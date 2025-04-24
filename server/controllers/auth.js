const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h" // <- Исправлено! Укажите любое корректное значение: "2d", "1h", 3600 (в секундах)
  });
};

// @desc    Регистрация пользователя
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Проверка обязательных полей
  if (!username || !email || !password) {
    return next(new ErrorResponse('Пожалуйста, заполните все обязательные поля', 400));
  }

  // Проверка существования пользователя
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('Пользователь с таким email уже существует', 400));
  }

  // Создание пользователя
  const user = await User.create({
    username,
    email,
    password,
    character: {
      mood: 'нейтрально',
      energy: 100,
      level: 1,
      experience: 0,
      avatar: 'default_avatar.png',
      worldType: 'сад',
      worldElements: ['дерево']
    },
    statistics: {
      tasksCompleted: 0,
      streakDays: 0,
      lastActivityDate: Date.now(),
      categoriesStats: {
        личноеРазвитие: { completed: 0, failed: 0 },
        работа: { completed: 0, failed: 0 },
        отношения: { completed: 0, failed: 0 },
        здоровье: { completed: 0, failed: 0 },
        творчество: { completed: 0, failed: 0 }
      }
    },
    achievements: [],
    strengths: [],
    weaknesses: [],
    settings: {
      notifications: {
        email: true,
        push: true,
        dailyReminder: true,
        reminderTime: '09:00'
      },
      theme: 'системная',
      language: 'русский'
    }
  });

  // Генерация токена верификации email
  if (process.env.EMAIL_VERIFICATION === 'true') {
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Создание URL для верификации email
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationToken}`;

    // Отправка email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Подтверждение email',
        message: `Для подтверждения email перейдите по ссылке: ${verificationUrl}`
      });

      res.status(201).json({
        success: true,
        message: 'Пользователь зарегистрирован. Письмо с подтверждением отправлено на email.'
      });
    } catch (error) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse('Ошибка отправки email', 500));
    }
  } else {
    // Если верификация email отключена
    user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false });

    // Генерация токена и отправка ответа
    sendTokenResponse(user, 201, res);
  }
});

// @desc    Подтверждение email
// @route   GET /api/v1/auth/verify-email/:token
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  // Получение хэша токена
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Поиск пользователя по токену и проверка срока действия
  const user = await User.findOne({
    emailVerificationToken,
    emailVerificationExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Недействительный токен', 400));
  }

  // Устанавливаем email как подтвержденный
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  // Перенаправление на страницу успешной верификации
  res.redirect(`${process.env.CLIENT_URL}/email-verified`);
});

// @desc    Вход пользователя
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Проверка наличия email и пароля
  if (!email || !password) {
    return next(new ErrorResponse('Пожалуйста, укажите email и пароль', 400));
  }

  // Поиск пользователя
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Неверные учетные данные', 401));
  }

  // Проверка активации email (если требуется)
  if (process.env.EMAIL_VERIFICATION === 'true' && !user.isEmailVerified) {
    return next(new ErrorResponse('Пожалуйста, подтвердите свой email', 401));
  }

  // Проверка пароля
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Неверные учетные данные', 401));
  }

  // Обновление времени последнего входа
  user.lastLogin = Date.now();
  // Обновление даты последней активности
  user.statistics.lastActivityDate = Date.now();
  await user.save({ validateBeforeSave: false });

  // Отправка токена
  sendTokenResponse(user, 200, res);
});

// @desc    Выход пользователя / Очистка куки
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Получение профиля текущего пользователя
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  // Обновление даты последней активности
  user.statistics.lastActivityDate = Date.now();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Обновление данных профиля
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    username: req.body.username,
    email: req.body.email
  };

  // Удаляем поля, которые не были переданы
  Object.keys(fieldsToUpdate).forEach(
    key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  // Если нет полей для обновления
  if (Object.keys(fieldsToUpdate).length === 0) {
    return next(new ErrorResponse('Не указаны поля для обновления', 400));
  }

  // Если обновляется email, сбрасываем флаг верификации
  if (fieldsToUpdate.email && process.env.EMAIL_VERIFICATION === 'true') {
    fieldsToUpdate.isEmailVerified = false;
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  // Если обновлен email и требуется верификация, отправляем письмо
  if (fieldsToUpdate.email && process.env.EMAIL_VERIFICATION === 'true') {
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Подтверждение нового email',
        message: `Для подтверждения нового email перейдите по ссылке: ${verificationUrl}`
      });

      res.status(200).json({
        success: true,
        data: user,
        message: 'Профиль обновлен. Письмо с подтверждением отправлено на новый email.'
      });
    } catch (error) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse('Ошибка отправки email', 500));
    }
  } else {
    res.status(200).json({
      success: true,
      data: user
    });
  }
});

// @desc    Обновление пароля
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Проверка наличия обоих паролей
  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Пожалуйста, укажите текущий и новый пароль', 400));
  }

  // Получаем пользователя с паролем
  const user = await User.findById(req.user.id).select('+password');

  // Проверка текущего пароля
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return next(new ErrorResponse('Неверный текущий пароль', 401));
  }

  // Установка нового пароля
  user.password = newPassword;
  await user.save();

  // Отправка нового токена
  sendTokenResponse(user, 200, res);
});

// @desc    Запрос на сброс пароля
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorResponse('Пожалуйста, укажите email', 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('Пользователь с таким email не найден', 404));
  }

  // Генерация токена сброса пароля
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Создание URL для сброса пароля
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // Отправка email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Сброс пароля',
      message: `Для сброса пароля перейдите по ссылке: ${resetUrl}`
    });

    res.status(200).json({
      success: true,
      message: 'Инструкции по сбросу пароля отправлены на email'
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Ошибка отправки email', 500));
  }
});

// @desc    Сброс пароля
// @route   PUT /api/v1/auth/resetpassword/:token
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Получение хэша токена
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Поиск пользователя по токену и проверка срока действия
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Недействительный токен', 400));
  }

  // Установка нового пароля
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Отправка токена
  sendTokenResponse(user, 200, res);
});

// @desc    Обновление настроек персонажа пользователя
// @route   PUT /api/v1/auth/character
// @access  Private
exports.updateCharacter = asyncHandler(async (req, res, next) => {
  const { mood, energy, avatar, worldType } = req.body;

  const user = await User.findById(req.user.id);

  // Обновляем только переданные поля
  if (mood) user.character.mood = mood;
  if (energy !== undefined) user.character.energy = energy;
  if (avatar) user.character.avatar = avatar;
  if (worldType) user.character.worldType = worldType;

  await user.save();

  res.status(200).json({
    success: true,
    data: user.character
  });
});

// @desc    Обновление настроек пользователя
// @route   PUT /api/v1/auth/settings
// @access  Private
exports.updateSettings = asyncHandler(async (req, res, next) => {
  const { notifications, theme, language } = req.body;

  const user = await User.findById(req.user.id);

  // Обновляем настройки уведомлений
  if (notifications) {
    if (notifications.email !== undefined) user.settings.notifications.email = notifications.email;
    if (notifications.push !== undefined) user.settings.notifications.push = notifications.push;
    if (notifications.dailyReminder !== undefined) user.settings.notifications.dailyReminder = notifications.dailyReminder;
    if (notifications.reminderTime) user.settings.notifications.reminderTime = notifications.reminderTime;
  }

  // Обновляем тему
  if (theme) user.settings.theme = theme;

  // Обновляем язык
  if (language) user.settings.language = language;

  await user.save();

  res.status(200).json({
    success: true,
    data: user.settings
  });
});

// @desc    Получение статистики пользователя
// @route   GET /api/v1/auth/stats
// @access  Private
exports.getUserStats = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const stats = {
    character: user.character,
    statistics: user.statistics,
    streakDays: user.statistics.streakDays,
    maxStreakDays: user.statistics.maxStreakDays,
    tasksCompleted: user.statistics.tasksCompleted,
    categoryStats: user.getCategoriesProgress(),
    experienceProgress: user.getExperienceProgress(),
    achievements: user.achievements.length
  };

  res.status(200).json({
    success: true,
    data: stats
  });
});

// Отправка JWT токена в куки
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  // Исправленный блок
  const cookieExpireDays = parseInt(process.env.JWT_EXPIRE); // Преобразуем в число
  const options = {
    expires: new Date(
      Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000 // Дни → миллисекунды
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        character: user.character,
        statistics: user.statistics,
        settings: user.settings
      }
    });
};