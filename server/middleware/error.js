// Middleware для логирования ошибок
exports.errorLogger = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err);
  next(err);
};

// Middleware для обработки ошибок
exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Ошибка дубликата в MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    error.message = `Дублирование поля ${field}. Пожалуйста, используйте другое значение.`;
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // Ошибка валидации Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
  }

  // Неверный ID в Mongoose
  if (err.name === 'CastError') {
    error.message = `Ресурс с ID ${err.value} не найден`;
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }

  // Стандартный ответ
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Внутренняя ошибка сервера',
  });
};