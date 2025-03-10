const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Защита маршрутов - проверка авторизации
exports.protect = async (req, res, next) => {
  let token;

  // Проверяем наличие токена в заголовках
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Проверяем существование токена
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Нет доступа. Авторизуйтесь для доступа к этому ресурсу',
    });
  }

  try {
    // Проверка токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Получаем пользователя из базы
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Пользователь с этим ID не найден',
      });
    }

    // Добавляем пользователя в запрос
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Не удалось авторизоваться. Токен недействителен',
    });
  }
};

// Проверка роли пользователя
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Роль ${req.user.role} не имеет доступа к этому ресурсу`,
      });
    }
    next();
  };
};