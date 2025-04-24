const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Защита маршрутов
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Проверяем наличие токена в заголовке Authorization или в cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Извлекаем токен из заголовка
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Извлекаем токен из cookie
    token = req.cookies.token;
  }

  // Проверяем наличие токена
  if (!token) {
    return next(new ErrorResponse('Нет авторизации для доступа к данному ресурсу', 401));
  }

  try {
    // Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Получаем пользователя из БД
    req.user = await User.findById(decoded.id);

    // Проверяем существование пользователя
    if (!req.user) {
      return next(new ErrorResponse('Пользователь не найден', 401));
    }

    // Проверяем активацию email (если требуется)
    if (process.env.EMAIL_VERIFICATION === 'true' && !req.user.isEmailVerified) {
      return next(new ErrorResponse('Пожалуйста, подтвердите свой email', 401));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Нет авторизации для доступа к данному ресурсу', 401));
  }
});

// Проверка роли пользователя
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Роль ${req.user.role} не имеет доступа к данному ресурсу`,
          403
        )
      );
    }
    next();
  };
};