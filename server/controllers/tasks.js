const Task = require('../models/Task');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Получение всех задач пользователя
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
  // Создаем запрос на получение задач с вложенным объектом, который учитывает различные параметры фильтрации
  let query = {
    user: req.user.id
  };

  // Копируем req.query
  const reqQuery = { ...req.query };

  // Поля для исключения из фильтрации
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Удаляем поля из reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Проверяем наличие условий фильтрации по категории
  if (reqQuery.category) {
    query.category = reqQuery.category;
  }

  // Проверяем наличие условий фильтрации по статусу
  if (reqQuery.status) {
    query.status = reqQuery.status;
  }

  // Проверяем наличие условий фильтрации по приоритету
  if (reqQuery.priority) {
    query.priority = reqQuery.priority;
  }

  // Проверяем наличие условий фильтрации по типу задачи
  if (reqQuery.taskType) {
    query.taskType = reqQuery.taskType;
  }

  // Фильтрация по истечению срока
  if (reqQuery.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (reqQuery.dueDate === 'today') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      query.dueDate = {
        $gte: today,
        $lt: tomorrow
      };
    } else if (reqQuery.dueDate === 'week') {
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      query.dueDate = {
        $gte: today,
        $lt: nextWeek
      };
    } else if (reqQuery.dueDate === 'overdue') {
      query.dueDate = {
        $lt: today
      };
      query.status = { $ne: 'выполнена' };
    }
  }

  // Фильтрация по тегам
  if (reqQuery.tags) {
    const tags = reqQuery.tags.split(',');
    query.tags = { $in: tags };
  }

  // Создание строки запроса
  let queryStr = JSON.stringify(query);

  // Создание операторов ($gt, $gte, $lt, $lte, $in)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Находим задачи
  let tasks = Task.find(JSON.parse(queryStr));

  // Выбор полей
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    tasks = tasks.select(fields);
  }

  // Сортировка
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    tasks = tasks.sort(sortBy);
  } else {
    tasks = tasks.sort('-createdAt');
  }

  // Пагинация
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Task.countDocuments(JSON.parse(queryStr));

  tasks = tasks.skip(startIndex).limit(limit);

  // Выполнение запроса
  const results = await tasks;

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
    count: results.length,
    pagination,
    total,
    data: results
  });
});

// @desc    Получение одной задачи
// @route   GET /api/v1/tasks/:id
// @access  Private
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Задача с ID ${req.params.id} не найдена`, 404));
  }

  // Проверка владельца задачи
  if (task.user.toString() !== req.user.id && req.user.role !== 'админ') {
    return next(new ErrorResponse('Нет доступа к этой задаче', 403));
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Создание новой задачи
// @route   POST /api/v1/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
  console.log('Received data:', req.body);
  // Добавляем ID пользователя к запросу
  req.body.user = req.user.id;

  // Проверяем обязательные поля
if (!req.body.title || !req.body.category) {
  return next(new ErrorResponse('Пожалуйста, укажите название и категорию задачи', 400));
}

  // Создание задачи
  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Обновление задачи
// @route   PUT /api/v1/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Задача с ID ${req.params.id} не найдена`, 404));
  }

  // Проверка владельца задачи
  if (task.user.toString() !== req.user.id && req.user.role !== 'админ') {
    return next(new ErrorResponse('Нет доступа к этой задаче', 403));
  }

  // Обновление задачи
  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Удаление задачи
// @route   DELETE /api/v1/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Задача с ID ${req.params.id} не найдена`, 404));
  }

  // Проверка владельца задачи
  if (task.user.toString() !== req.user.id && req.user.role !== 'админ') {
    return next(new ErrorResponse('Нет доступа к этой задаче', 403));
  }

  // Удаление задачи
  await task.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Выполнение задачи
// @route   PUT /api/v1/tasks/:id/complete
// @access  Private
exports.completeTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Задача с ID ${req.params.id} не найдена`, 404));
  }

  // Проверка владельца задачи
  if (task.user.toString() !== req.user.id && req.user.role !== 'админ') {
    return next(new ErrorResponse('Нет доступа к этой задаче', 403));
  }

  // Получаем пользователя
  const user = await User.findById(req.user.id);

  // Проверяем, достаточно ли энергии для выполнения задачи
  const energyCost = 10; // Базовая стоимость выполнения задачи
  if (user.character.energy < energyCost) {
    return next(new ErrorResponse('Недостаточно энергии для выполнения задачи', 400));
  }

  // Подготовка данных для обновления
  const updateData = {
    status: 'выполнена',
    'reflection.completedAt': Date.now()
  };

  // Если есть данные рефлексии, добавляем их
  if (req.body.mood) updateData['reflection.mood'] = req.body.mood;
  if (req.body.notes) updateData['reflection.notes'] = req.body.notes;
  if (req.body.perceivedDifficulty) updateData['reflection.perceivedDifficulty'] = req.body.perceivedDifficulty;

  // Обновление задачи
  task = await Task.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  // Обновление статистики пользователя
  user.statistics.tasksCompleted += 1;
  
  // Обновление статистики по категориям
  const category = task.category.replace(/\s+/g, '');
  if (user.statistics.categoriesStats[category]) {
    user.statistics.categoriesStats[category].completed += 1;
  }

  // Расчет наград
  const experienceGain = task.calculateExperience();
  const energyGain = task.calculateEnergy();

  // Добавляем опыт персонажу
  user.addExperience(experienceGain);
  
  // Изменяем энергию персонажа
  user.changeEnergy(energyGain - energyCost);

  // Обновляем дату последней активности
  user.statistics.lastActivityDate = Date.now();

  await user.save();

  // Формируем ответ с информацией о награде
  const response = {
    success: true,
    data: task,
    rewards: {
      experience: experienceGain,
      energy: energyGain - energyCost,
      levelUp: user.character.experience < experienceGain, // Если уровень изменился
      newLevel: user.character.level
    },
    characterState: {
      mood: user.character.mood,
      energy: user.character.energy,
      level: user.character.level,
      experience: user.character.experience,
      experienceToNextLevel: user.character.experienceToNextLevel
    }
  };

  res.status(200).json(response);
});

// @desc    Отметка задачи как невыполненной
// @route   PUT /api/v1/tasks/:id/fail
// @access  Private
exports.failTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Задача с ID ${req.params.id} не найдена`, 404));
  }

  // Проверка владельца задачи
  if (task.user.toString() !== req.user.id && req.user.role !== 'админ') {
    return next(new ErrorResponse('Нет доступа к этой задаче', 403));
  }

  // Подготовка данных для обновления
  const updateData = {
    status: 'провалена',
    'reflection.completedAt': Date.now()
  };

  // Если есть данные рефлексии, добавляем их
  if (req.body.mood) updateData['reflection.mood'] = req.body.mood;
  if (req.body.notes) updateData['reflection.notes'] = req.body.notes;
  if (req.body.perceivedDifficulty) updateData['reflection.perceivedDifficulty'] = req.body.perceivedDifficulty;

  // Обновление задачи
  task = await Task.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  // Обновление статистики пользователя
  const user = await User.findById(req.user.id);
  
  // Обновление статистики по категориям
  const category = task.category.replace(/\s+/g, '');
  if (user.statistics.categoriesStats[category]) {
    user.statistics.categoriesStats[category].failed += 1;
  }

  // Уменьшаем энергию персонажа из-за неудачи
  const energyLoss = -5;
  user.changeEnergy(energyLoss);

  // Обновляем настроение (если не указано)
  if (!req.body.mood) {
    // Понижаем настроение при провале задачи
    if (user.character.mood === 'отлично') {
      user.character.mood = 'хорошо';
    } else if (user.character.mood === 'хорошо') {
      user.character.mood = 'нейтрально';
    } else if (user.character.mood === 'нейтрально') {
      user.character.mood = 'плохо';
    }
  }

  // Обновляем дату последней активности
  user.statistics.lastActivityDate = Date.now();

  await user.save();

  res.status(200).json({
    success: true,
    data: task,
    effects: {
      energy: energyLoss
    },
    characterState: {
      mood: user.character.mood,
      energy: user.character.energy
    }
  });
});

// @desc    Отложить задачу
// @route   PUT /api/v1/tasks/:id/postpone
// @access  Private
exports.postponeTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Задача с ID ${req.params.id} не найдена`, 404));
  }

  // Проверка владельца задачи
  if (task.user.toString() !== req.user.id && req.user.role !== 'админ') {
    return next(new ErrorResponse('Нет доступа к этой задаче', 403));
  }

  // Проверяем наличие новой даты
  if (!req.body.dueDate) {
    return next(new ErrorResponse('Необходимо указать новую дату выполнения', 400));
  }

  // Подготовка данных для обновления
  const updateData = {
    status: 'отложена',
    dueDate: new Date(req.body.dueDate)
  };

  // Обновление задачи
  task = await Task.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Создание подзадачи
// @route   POST /api/v1/tasks/:id/subtasks
// @access  Private
exports.addSubtask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Задача с ID ${req.params.id} не найдена`, 404));
  }

  // Проверка владельца задачи
  if (task.user.toString() !== req.user.id && req.user.role !== 'админ') {
    return next(new ErrorResponse('Нет доступа к этой задаче', 403));
  }

  // Проверка типа задачи
  if (task.taskType !== 'долгосрочная' && task.taskType !== 'босс') {
    return next(new ErrorResponse('Подзадачи можно добавлять только к долгосрочным задачам', 400));
  }

  // Проверка наличия названия подзадачи
  if (!req.body.title) {
    return next(new ErrorResponse('Необходимо указать название подзадачи', 400));
  }

  // Создание подзадачи
  const subtask = {
    title: req.body.title,
    completed: false
  };

  // Если указан срок выполнения
  if (req.body.dueDate) {
    subtask.dueDate = new Date(req.body.dueDate);
  }

  // Добавление подзадачи
  task.subtasks.push(subtask);
  
  // Если это первая подзадача, устанавливаем прогресс в 0
  if (task.subtasks.length === 1) {
    task.progress = 0;
  } else {
    // Пересчитываем прогресс
    const completedSubtasks = task.subtasks.filter(sub => sub.completed).length;
    task.progress = Math.floor((completedSubtasks / task.subtasks.length) * 100);
  }

  await task.save();

  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Обновление подзадачи
// @route   PUT /api/v1/tasks/:id/subtasks/:subtaskId
// @access  Private
exports.updateSubtask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Задача с ID ${req.params.id} не найдена`, 404));
  }

  // Проверка владельца задачи
  if (task.user.toString() !== req.user.id && req.user.role !== 'админ') {
    return next(new ErrorResponse('Нет доступа к этой задаче', 403));
  }

  // Поиск подзадачи
  const subtask = task.subtasks.id(req.params.subtaskId);

  if (!subtask) {
    return next(new ErrorResponse(`Подзадача с ID ${req.params.subtaskId} не найдена`, 404));
  }

  // Обновление подзадачи
  if (req.body.title) subtask.title = req.body.title;
  if (req.body.completed !== undefined) subtask.completed = req.body.completed;
  if (req.body.dueDate) subtask.dueDate = new Date(req.body.dueDate);

  // Пересчет прогресса основной задачи
  const completedSubtasks = task.subtasks.filter(sub => sub.completed).length;
  task.progress = Math.floor((completedSubtasks / task.subtasks.length) * 100);

  // Если все подзадачи выполнены, устанавливаем статус "выполнена" для основной задачи
  if (task.progress === 100 && task.status !== 'выполнена') {
    task.status = 'выполнена';
    task.reflection.completedAt = Date.now();
    
    // Обновление статистики пользователя
    const user = await User.findById(req.user.id);
    user.statistics.tasksCompleted += 1;
    
    // Обновление статистики по категориям
    const category = task.category.replace(/\s+/g, '');
    if (user.statistics.categoriesStats[category]) {
      user.statistics.categoriesStats[category].completed += 1;
    }

    // Расчет наград
    const experienceGain = task.calculateExperience();
    const energyGain = task.calculateEnergy();

    // Добавляем опыт персонажу
    user.addExperience(experienceGain);
    
    // Изменяем энергию персонажа
    user.changeEnergy(energyGain);

    await user.save();
  }

  await task.save();

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Удаление подзадачи
// @route   DELETE /api/v1/tasks/:id/subtasks/:subtaskId
// @access  Private
exports.deleteSubtask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Задача с ID ${req.params.id} не найдена`, 404));
  }

  // Проверка владельца задачи
  if (task.user.toString() !== req.user.id && req.user.role !== 'админ') {
    return next(new ErrorResponse('Нет доступа к этой задаче', 403));
  }

  // Поиск подзадачи
  const subtask = task.subtasks.id(req.params.subtaskId);

  if (!subtask) {
    return next(new ErrorResponse(`Подзадача с ID ${req.params.subtaskId} не найдена`, 404));
  }

  // Удаление подзадачи
  subtask.deleteOne();

  // Пересчет прогресса основной задачи, если остались подзадачи
  if (task.subtasks.length > 0) {
    const completedSubtasks = task.subtasks.filter(sub => sub.completed).length;
    task.progress = Math.floor((completedSubtasks / task.subtasks.length) * 100);
  } else {
    task.progress = 0;
  }

  await task.save();

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Получение сегодняшних задач пользователя
// @route   GET /api/v1/tasks/today
// @access  Private
exports.getTodayTasks = asyncHandler(async (req, res, next) => {
  // Определяем даты для сегодняшнего дня
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Получаем день недели (0 - воскресенье, 1 - понедельник и т.д.)
  const dayOfWeek = today.getDay();
  // Преобразуем в формат, используемый в базе данных
  const daysOfWeek = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  const dayCode = daysOfWeek[dayOfWeek];

  // Находим задачи на сегодня:
  // 1. Ежедневные задачи, у которых сегодня день выполнения
  // 2. Привычки, запланированные на сегодня
  // 3. Разовые задачи с дедлайном на сегодня
  // 4. Задачи без дедлайна в статусе "запланирована" или "в процессе"
  const tasks = await Task.find({
    user: req.user.id,
    $or: [
      { 
        taskType: 'ежедневная',
        repeatDays: dayCode,
        status: { $ne: 'выполнена' }
      },
      { 
        taskType: 'привычка',
        repeatDays: dayCode,
        status: { $ne: 'выполнена' }
      },
      {
        dueDate: {
          $gte: today,
          $lt: tomorrow
        },
        status: { $ne: 'выполнена' }
      },
      {
        status: { $in: ['запланирована', 'в процессе'] },
        dueDate: null
      }
    ]
  }).sort({ priority: -1, dueDate: 1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Обновление прогресса долгосрочной задачи
// @route   PUT /api/v1/tasks/:id/progress
// @access  Private
exports.updateTaskProgress = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Задача с ID ${req.params.id} не найдена`, 404));
  }

  // Проверка владельца задачи
  if (task.user.toString() !== req.user.id && req.user.role !== 'админ') {
    return next(new ErrorResponse('Нет доступа к этой задаче', 403));
  }

  // Проверка типа задачи
  if (task.taskType !== 'долгосрочная' && task.taskType !== 'босс') {
    return next(new ErrorResponse('Прогресс можно обновлять только для долгосрочных задач', 400));
  }

  // Проверка наличия значения прогресса
  if (req.body.progress === undefined) {
    return next(new ErrorResponse('Необходимо указать значение прогресса', 400));
  }

  // Валидация значения прогресса
  const progress = parseInt(req.body.progress);
  if (isNaN(progress) || progress < 0 || progress > 100) {
    return next(new ErrorResponse('Прогресс должен быть числом от 0 до 100', 400));
  }

  // Обновление прогресса
  task.progress = progress;

  // Если прогресс 100%, устанавливаем статус "выполнена"
  if (progress === 100 && task.status !== 'выполнена') {
    task.status = 'выполнена';
    task.reflection.completedAt = Date.now();
    
    // Если есть данные рефлексии, добавляем их
    if (req.body.mood) task.reflection.mood = req.body.mood;
    if (req.body.notes) task.reflection.notes = req.body.notes;
    if (req.body.perceivedDifficulty) task.reflection.perceivedDifficulty = req.body.perceivedDifficulty;
    
    // Обновление статистики пользователя при завершении задачи
    const user = await User.findById(req.user.id);
    user.statistics.tasksCompleted += 1;
    
    // Обновление статистики по категориям
    const category = task.category.replace(/\s+/g, '');
    if (user.statistics.categoriesStats[category]) {
      user.statistics.categoriesStats[category].completed += 1;
    }

    // Расчет наград
    const experienceGain = task.calculateExperience();
    const energyGain = task.calculateEnergy();

    // Добавляем опыт персонажу
    user.addExperience(experienceGain);
    
    // Изменяем энергию персонажа
    user.changeEnergy(energyGain);

    await user.save();
  }

  await task.save();

  res.status(200).json({
    success: true,
    data: task
  });
});