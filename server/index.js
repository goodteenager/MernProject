const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Загрузка переменных окружения
dotenv.config();

console.log("Текущая директория:", __dirname);
console.log("Проверка пути auth.js:", require.resolve('./routes/auth.js'));

// Подключение к базе данных
connectDB();

// Импорт маршрутов
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const fileRoutes = require('./routes/files');
const reportsRoutes = require('./routes/reports');
const achievementsRoutes = require('./routes/achievements');

// Создание экземпляра Express
const app = express();
const PORT = process.env.PORT || 5000;

// Добавляем в начало файла после импортов
const SERVER_ID = process.env.SERVER_ID || 'unknown';

// Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// Используйте после этого вашу стандартную конфигурацию CORS
// Настройка CORS
app.use(cors({
  origin: 'http://localhost:3000', // URL вашего фронтенда
  credentials: true // Разрешаем передачу куки
}));

// Безопасная настройка trust proxy
app.set('trust proxy', 'loopback, linklocal, uniquelocal');

// Заменяем небезопасный rateLimit на более безопасный
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов за период
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Используем X-Forwarded-For в качестве ключа, если доверяем прокси
    return req.headers['x-forwarded-for'] || req.ip;
  },
  skip: (req) => {
    // Пропускаем определенные пути, если нужно
    return false;
  }
}));

app.use(helmet()); // Безопасность
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

// Ограничение запросов (защита от DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов за период
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Защита от XSS-атак
app.use(xss());

// Защита от HTTP Parameter Pollution
app.use(hpp());

// Очистка данных от MongoDB-инъекций
app.use(mongoSanitize());

// Модифицируем middleware для логирования, добавив идентификатор сервера
app.use((req, res, next) => {
  console.log(`[${SERVER_ID}] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Маршруты
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/files', fileRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/achievements', achievementsRoutes);

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'Добро пожаловать в API',
    status: 'Сервер работает',
    timestamp: new Date().toISOString()
  });
});

// Обработка несуществующих маршрутов
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Маршрут ${req.originalUrl} не найден`
  });
});

// Обработка ошибок
app.use(errorHandler);

// Endpoint для проверки здоровья системы
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    server: process.env.SERVER_ID || 'unknown',
    timestamp: new Date().toISOString()
  });
});

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`[${SERVER_ID}] Подключение к MongoDB успешно`);
    const server = app.listen(PORT, '0.0.0.0', () => { // Явно указываем хост
      console.log(`[${SERVER_ID}] Сервер запущен на порту ${PORT}`);
    });

    // Обработка необработанных отклонений promise
    process.on('unhandledRejection', (err, promise) => {
      console.log(`Ошибка: ${err.message}`.red);
      // Закрытие сервера и выход из процесса
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    console.error(`[${SERVER_ID}] Ошибка подключения к MongoDB:`, err.message);
    process.exit(1); // Прекращаем работу, если база не подключена
  });