const Achievement = require('../models/Achievement');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Получение всех достижений
// @route   GET /api/v1/achievements
// @access  Private
exports.getAchievements = asyncHandler(async (req, res, next) => {
  // Базовый запрос
  let query = {};

  // Копируем req.query
  const reqQuery = { ...req.query };

  // Поля для исключения из фильтрации
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Удаляем поля из reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Фильтрация по категории
  if (reqQuery.category) {
    query.category = reqQuery.category;
  }

  // Фильтрация по редкости
  if (reqQuery.rarity) {
    query.rarity = reqQuery.rarity;
  }

  // Фильтрация по типу
  if (reqQuery.type) {
    query.type = reqQuery.type;
  }

  // Фильтрация по активности
  if (reqQuery.isActive !== undefined) {
    query.isActive = reqQuery.isActive === 'true';
  }

  // По умолчанию не показываем скрытые достижения, если не указано обратное
  if (reqQuery.includeHidden !== 'true' && reqQuery.hidden !== 'true') {
    query.hidden = false;
  }

  // Создание строки запроса
  let queryStr = JSON.stringify(query);

  // Создание операторов ($gt, $gte, $lt, $lte, $in)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Находим достижения
  let achievements = Achievement.find(JSON.parse(queryStr));

  // Выбор полей
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    achievements = achievements.select(fields);
  }

  // Сортировка
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    achievements = achievements.sort(sortBy);
  } else {
    achievements = achievements.sort('rarity');
  }

  // Пагинация
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Achievement.countDocuments(JSON.parse(queryStr));

  achievements = achievements.skip(startIndex).limit(limit);

  // Выполнение запроса
  const results = await achievements;

  // Получение достижений пользователя для проверки полученных
  const user = await User.findById(req.user.id);
  const userAchievementIds = user.achievements.map(a => a.achievementId);

  // Добавляем информацию о том, получено ли достижение пользователем
  const achievementsWithStatus = results.map(achievement => {
    const achievementObj = achievement.toObject();
    achievementObj.isEarned = userAchievementIds.includes(achievement.achievementId);
    
    // Если достижение скрыто и не получено, скрываем детали
    if (achievement.hidden && !achievementObj.isEarned) {
      achievementObj.title = '???';
      achievementObj.description = 'Это достижение пока скрыто';
      achievementObj.condition = undefined;
    }
    
    return achievementObj;
  });

  // Объект пагинации
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: achievementsWithStatus.length,
    pagination,
    total,
    data: achievementsWithStatus
  });
});

// @desc    Получение одного достижения
// @route   GET /api/v1/achievements/:id
// @access  Private
exports.getAchievement = asyncHandler(async (req, res, next) => {
  const achievement = await Achievement.findById(req.params.id);

  if (!achievement) {
    return next(new ErrorResponse(`Достижение с ID ${req.params.id} не найдено`, 404));
  }

  // Получение достижений пользователя для проверки
  const user = await User.findById(req.user.id);
  const userAchievementIds = user.achievements.map(a => a.achievementId);
  
  // Проверяем, получено ли достижение пользователем
  const isEarned = userAchievementIds.includes(achievement.achievementId);
  
  // Если достижение скрыто и не получено, ограничиваем доступ
  if (achievement.hidden && !isEarned && req.user.role !== 'админ') {
    return res.status(200).json({
      success: true,
      data: {
        _id: achievement._id,
        title: '???',
        description: 'Это достижение пока скрыто',
        icon: 'hidden_achievement.png',
        rarity: achievement.rarity,
        hidden: true,
        isEarned: false
      }
    });
  }

  // Добавляем информацию о статусе достижения
  const achievementWithStatus = achievement.toObject();
  achievementWithStatus.isEarned = isEarned;
  
  // Если достижение получено, добавляем дату получения
  if (isEarned) {
    const userAchievement = user.achievements.find(a => a.achievementId === achievement.achievementId);
    achievementWithStatus.dateEarned = userAchievement ? userAchievement.dateEarned : null;
  }

  res.status(200).json({
    success: true,
    data: achievementWithStatus
  });
});

// @desc    Создание нового достижения (только для админов)
// @route   POST /api/v1/achievements
// @access  Private/Admin
exports.createAchievement = asyncHandler(async (req, res, next) => {
  // Проверка роли пользователя
  if (req.user.role !== 'админ') {
    return next(new ErrorResponse('Нет прав для создания достижений', 403));
  }

  // Проверяем обязательные поля
  if (!req.body.achievementId || !req.body.title || !req.body.description || !req.body.condition) {
    return next(new ErrorResponse('Пожалуйста, заполните все обязательные поля', 400));
  }

  // Проверка уникальности achievementId
  const existingAchievement = await Achievement.findOne({ achievementId: req.body.achievementId });
  if (existingAchievement) {
    return next(new ErrorResponse('Достижение с таким ID уже существует', 400));
  }

  // Создание достижения
  const achievement = await Achievement.create(req.body);

  res.status(201).json({
    success: true,
    data: achievement
  });
});

// @desc    Обновление достижения (только для админов)
// @route   PUT /api/v1/achievements/:id
// @access  Private/Admin
exports.updateAchievement = asyncHandler(async (req, res, next) => {
  // Проверка роли пользователя
  if (req.user.role !== 'админ') {
    return next(new ErrorResponse('Нет прав для обновления достижений', 403));
  }

  let achievement = await Achievement.findById(req.params.id);

  if (!achievement) {
    return next(new ErrorResponse(`Достижение с ID ${req.params.id} не найдено`, 404));
  }

  // Проверка уникальности achievementId при изменении
  if (req.body.achievementId && req.body.achievementId !== achievement.achievementId) {
    const existingAchievement = await Achievement.findOne({ achievementId: req.body.achievementId });
    if (existingAchievement) {
      return next(new ErrorResponse('Достижение с таким ID уже существует', 400));
    }
  }

  // Обновление достижения
  achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: achievement
  });
});

// @desc    Удаление достижения (только для админов)
// @route   DELETE /api/v1/achievements/:id
// @access  Private/Admin
exports.deleteAchievement = asyncHandler(async (req, res, next) => {
  // Проверка роли пользователя
  if (req.user.role !== 'админ') {
    return next(new ErrorResponse('Нет прав для удаления достижений', 403));
  }

  const achievement = await Achievement.findById(req.params.id);

  if (!achievement) {
    return next(new ErrorResponse(`Достижение с ID ${req.params.id} не найдено`, 404));
  }

  // Удаление достижения
  await achievement.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Получение достижений пользователя
// @route   GET /api/v1/achievements/user
// @access  Private
exports.getUserAchievements = asyncHandler(async (req, res, next) => {
  // Получаем пользователя с достижениями
  const user = await User.findById(req.user.id);
  
  // Получаем ID достижений пользователя
  const userAchievementIds = user.achievements.map(a => a.achievementId);
  
  // Находим полные данные о достижениях
  const achievements = await Achievement.find({
    achievementId: { $in: userAchievementIds }
  });
  
  // Объединяем данные о достижениях с датами получения
  const userAchievementsWithData = achievements.map(achievement => {
    const userAchievement = user.achievements.find(a => a.achievementId === achievement.achievementId);
    
    return {
      ...achievement.toObject(),
      dateEarned: userAchievement.dateEarned,
      isEarned: true
    };
  });
  
  res.status(200).json({
    success: true,
    count: userAchievementsWithData.length,
    data: userAchievementsWithData
  });
});

// @desc    Проверка достижений пользователя
// @route   POST /api/v1/achievements/check
// @access  Private
exports.checkAchievements = asyncHandler(async (req, res, next) => {
  // Получаем пользователя
  const user = await User.findById(req.user.id);
  
  // Получаем все активные достижения
  const achievements = await Achievement.find({ isActive: true });
  
  // Список уже полученных достижений
  const userAchievementIds = user.achievements.map(a => a.achievementId);
  
  // Новые достижения, которые получил пользователь
  const newAchievements = [];
  
  // Проверяем каждое достижение
  for (const achievement of achievements) {
    // Пропускаем, если достижение уже получено
    if (userAchievementIds.includes(achievement.achievementId)) {
      continue;
    }
    
    // Проверяем условия получения
    const isEarned = await checkAchievementCondition(user, achievement);
    
    if (isEarned) {
      // Добавляем достижение пользователю
      user.achievements.push({
        achievementId: achievement.achievementId,
        title: achievement.title,
        description: achievement.description,
        dateEarned: Date.now(),
        icon: achievement.icon
      });
      
      // Добавляем опыт и энергию от достижения
      if (achievement.reward) {
        if (achievement.reward.experience) {
          user.addExperience(achievement.reward.experience);
        }
        
        if (achievement.reward.energy) {
          user.changeEnergy(achievement.reward.energy);
        }
        
        // Добавляем элемент мира, если есть
        if (achievement.reward.worldElement && 
            !user.character.worldElements.includes(achievement.reward.worldElement)) {
          user.character.worldElements.push(achievement.reward.worldElement);
        }
      }
      
      // Добавляем в список новых достижений
      newAchievements.push({
        ...achievement.toObject(),
        dateEarned: Date.now()
      });
    }
  }
  
  // Сохраняем изменения пользователя
  if (newAchievements.length > 0) {
    await user.save();
  }
  
  res.status(200).json({
    success: true,
    count: newAchievements.length,
    data: newAchievements
  });
});

// Функция для проверки условий получения достижения
const checkAchievementCondition = async (user, achievement) => {
  const condition = achievement.condition;
  
  // Если нет условия, достижение нельзя получить
  if (!condition || !condition.parameter || !condition.value) {
    return false;
  }
  
  // Значение параметра пользователя
  let userValue;
  
  // Определяем значение в зависимости от параметра
  switch (condition.parameter) {
    case 'tasksCompleted':
      userValue = user.statistics.tasksCompleted;
      break;
    
    case 'streakDays':
      userValue = user.statistics.streakDays;
      break;
    
    case 'level':
      userValue = user.character.level;
      break;
    
    case 'loginDays':
      // Для этого параметра надо считать количество дней с регистрации
      const registrationDate = new Date(user.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - registrationDate);
      userValue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      break;
    
    case 'taskCategory':
      // Для этого параметра нужны дополнительные данные
      if (!condition.additionalConditions || !condition.additionalConditions.category) {
        return false;
      }
      
      const category = condition.additionalConditions.category.replace(/\s+/g, '');
      userValue = user.statistics.categoriesStats[category] 
        ? user.statistics.categoriesStats[category].completed 
        : 0;
      break;
    
    case 'reflections':
      // Количество созданных отчетов
      // Для этого нужен запрос к базе данных отчетов
      const Report = require('../models/Report');
      userValue = await Report.countDocuments({ user: user._id });
      break;
    
    default:
      return false;
  }
  
  // Проверяем условие в зависимости от оператора
  switch (condition.operator) {
    case '=':
      return userValue === condition.value;
    
    case '>':
      return userValue > condition.value;
    
    case '>=':
      return userValue >= condition.value;
    
    default:
      return false;
  }
}; 