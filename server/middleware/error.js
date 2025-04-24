const ErrorResponse = require('../utils/errorResponse');

// Middleware для логирования ошибок
exports.errorLogger = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err);
  next(err);
};

// Middleware для обработки ошибок
exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Логирование ошибок в консоль для разработки
  console.log(err.stack.red);

  // Ошибка MongoDB: неверный ID
  if (err.name === 'CastError') {
    const message = 'Ресурс не найден';
    error = new ErrorResponse(message, 404);
  }

  // Ошибка MongoDB: дублирующееся поле
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Поле ${field} должно быть уникальным`;
    error = new ErrorResponse(message, 400);
  }

  // Ошибка MongoDB: ошибка валидации
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  // Ошибка JWT: истекший токен
  if (err.name === 'TokenExpiredError') {
    const message = 'Срок действия токена истек. Пожалуйста, войдите снова';
    error = new ErrorResponse(message, 401);
  }

  // Ошибка JWT: недействительный токен
  if (err.name === 'JsonWebTokenError') {
    const message = 'Недействительный токен. Пожалуйста, войдите снова';
    error = new ErrorResponse(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Ошибка сервера'
  });
};

module.exports = exports.errorHandler;