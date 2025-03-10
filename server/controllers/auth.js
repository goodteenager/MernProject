const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Генерация JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Регистрация пользователя
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Добавляем валидацию
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, заполните все обязательные поля',
      });
    }

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким email уже существует',
      });
    }

    // Создаем пользователя
    const user = await User.create({
      username,
      email,
      password,
    });

    // Генерируем токен
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // Улучшаем обработку ошибок
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации данных',
        errors: Object.values(error.errors).map(err => err.message),
      });
    }
    next(error);
  }
};

// Вход пользователя
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Проверяем наличие email и пароля
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, укажите email и пароль',
      });
    }

    // Ищем пользователя
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Неверные учетные данные',
      });
    }

    // Проверяем пароль
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Неверные учетные данные',
      });
    }

    // Генерируем токен
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Получение профиля текущего пользователя
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};