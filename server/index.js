const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

// Загрузка переменных окружения
dotenv.config();

console.log("Текущая директория:", __dirname);
console.log("Проверка пути auth.js:", require.resolve('./routes/auth.js'));

// Импорт маршрутов
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const fileRoutes = require('./routes/files');

// Создание экземпляра Express
const app = express();
const PORT = process.env.PORT || 5000;

// Добавляем в начало файла после импортов
const SERVER_ID = process.env.SERVER_ID || 'unknown';

// Middleware
app.use(cors());
app.use(helmet()); // Безопасность
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Ограничение запросов (защита от DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов за период
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Модифицируем middleware для логирования, добавив идентификатор сервера
app.use((req, res, next) => {
  console.log(`[${SERVER_ID}] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/files', fileRoutes);

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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
});

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
    app.listen(PORT, () => {
      console.log(`[${SERVER_ID}] Сервер запущен на порту ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`[${SERVER_ID}] Ошибка подключения к MongoDB:`, err.message);
    process.exit(1); // Прекращаем работу, если база не подключена
  });