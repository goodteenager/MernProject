const Report = require('../models/Report');
const Task = require('../models/Task');
const User = require('../models/User');
const MentorTip = require('../models/MentorTip');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Создание нового отчета
// @route   POST /api/v1/reports
// @access  Private
exports.createReport = asyncHandler(async (req, res, next) => {
  // Добавляем ID пользователя к запросу
  req.body.user = req.user.id;

  // Проверяем обязательные поля
  if (!req.body.rating || !req.body.mood || !req.body.energyLevel) {
    return next(new ErrorResponse('Пожалуйста, заполните все обязательные поля', 400));
  }

  // Определяем тип отчета (по умолчанию ежедневный)
  req.body.reportType = req.body.reportType || 'ежедневный';

  // Получаем пользователя
  const user = await User.findById(req.user.id);

  // Получаем завершенные и невыполненные задачи для отчета
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  // Для еженедельного и ежемесячного отчета корректируем даты
  let dateRange = {};
  if (req.body.reportType === 'ежедневный') {
    dateRange = {
      $gte: startDate,
      $lte: endDate
    };
  } else if (req.body.reportType === 'еженедельный') {
    // Получаем начало недели (понедельник)
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(startDate);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    
    dateRange = {
      $gte: weekStart,
      $lte: endDate
    };
  } else if (req.body.reportType === 'ежемесячный') {
    // Получаем начало месяца
    const monthStart = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);
    
    dateRange = {
      $gte: monthStart,
      $lte: endDate
    };
  }

  // Получаем задачи за период
  const completedTasks = await Task.find({
    user: req.user.id,
    'reflection.completedAt': dateRange,
    status: 'выполнена'
  });

  const failedTasks = await Task.find({
    user: req.user.id,
    'reflection.completedAt': dateRange,
    status: 'провалена'
  });

  const inProgressTasks = await Task.find({
    user: req.user.id,
    status: 'в процессе'
  });

  // Подсчет статистики по категориям
  const categoryStats = {
    личноеРазвитие: { completed: 0, failed: 0, total: 0 },
    работа: { completed: 0, failed: 0, total: 0 },
    отношения: { completed: 0, failed: 0, total: 0 },
    здоровье: { completed: 0, failed: 0, total: 0 },
    творчество: { completed: 0, failed: 0, total: 0 }
  };

  // Обрабатываем завершенные задачи
  completedTasks.forEach(task => {
    const category = task.category.replace(/\s+/g, '');
    if (categoryStats[category]) {
      categoryStats[category].completed += 1;
      categoryStats[category].total += 1;
    }
  });

  // Обрабатываем проваленные задачи
  failedTasks.forEach(task => {
    const category = task.category.replace(/\s+/g, '');
    if (categoryStats[category]) {
      categoryStats[category].failed += 1;
      categoryStats[category].total += 1;
    }
  });

  // Подготовка данных для отчета
  const reportData = {
    user: req.user.id,
    date: Date.now(),
    reportType: req.body.reportType,
    rating: req.body.rating,
    mood: req.body.mood,
    energyLevel: req.body.energyLevel,
    taskStats: {
      completed: completedTasks.map(task => task._id),
      completedCount: completedTasks.length,
      failed: failedTasks.map(task => task._id),
      failedCount: failedTasks.length,
      inProgress: inProgressTasks.map(task => task._id),
      inProgressCount: inProgressTasks.length
    },
    categoryStats,
    reflection: {
      positive: req.body.positive || '',
      negative: req.body.negative || '',
      lessons: req.body.lessons || ''
    }
  };

  // Добавляем цели на следующий период, если есть
  if (req.body.nextPeriodGoals && Array.isArray(req.body.nextPeriodGoals)) {
    reportData.nextPeriodGoals = req.body.nextPeriodGoals;
  }

  // Добавляем сильные стороны, если есть
  if (req.body.strengths && Array.isArray(req.body.strengths)) {
    reportData.strengths = req.body.strengths;
  }

  // Добавляем слабые стороны, если есть
  if (req.body.weaknesses && Array.isArray(req.body.weaknesses)) {
    reportData.weaknesses = req.body.weaknesses;
  }

  // Получаем данные о навыках из задач
  const skillsProgress = {};
  completedTasks.forEach(task => {
    if (task.skills && task.skills.length > 0) {
      task.skills.forEach(skill => {
        if (!skillsProgress[skill]) {
          skillsProgress[skill] = 0;
        }
        skillsProgress[skill] += 1;
      });
    }
  });

  // Преобразуем данные о навыках в формат для сохранения
  reportData.skillsProgress = Object.keys(skillsProgress).map(skill => ({
    skill,
    progress: Math.min(10, skillsProgress[skill])
  }));

  // Подбираем советы от "наставника"
  let mentorTips = [];
  
  // Определяем тип ситуации для советов
  let situationType = 'общее';
  
  // Если рейтинг низкий, показываем поддерживающие советы
  if (req.body.rating <= 4) {
    situationType = 'низкая мотивация';
  } 
  // Если много завершенных задач, показываем поздравления
  else if (completedTasks.length >= 3) {
    situationType = 'серия задач';
  }
  // Если в основном неудачи, показываем поддержку
  else if (failedTasks.length > completedTasks.length) {
    situationType = 'провал задачи';
  }
  
  // Получаем подходящие советы
  const tips = await MentorTip.find({
    situationType,
    isActive: true
  }).limit(3);
  
  reportData.mentorTips = tips.map(tip => ({
    tip: tip.text,
    category: tip.category
  }));

  // Создаем отчет
  const report = await Report.create(reportData);

  // Обновляем данные пользователя на основе отчета
  // Добавляем или обновляем сильные стороны
  if (req.body.strengths && Array.isArray(req.body.strengths)) {
    req.body.strengths.forEach(strength => {
      // Проверяем, есть ли уже такая сильная сторона
      const existingStrength = user.strengths.find(s => s.title === strength.title);
      if (existingStrength) {
        // Обновляем описание, если есть
        if (strength.details) {
          existingStrength.description = strength.details;
        }
      } else {
        // Добавляем новую сильную сторону
        user.strengths.push({
          title: strength.title,
          description: strength.details || '',
          level: 1
        });
      }
    });
  }

  // Добавляем или обновляем слабые стороны
  if (req.body.weaknesses && Array.isArray(req.body.weaknesses)) {
    req.body.weaknesses.forEach(weakness => {
      // Проверяем, есть ли уже такая слабая сторона
      const existingWeakness = user.weaknesses.find(w => w.title === weakness.title);
      if (existingWeakness) {
        // Обновляем описание, если есть
        if (weakness.details) {
          existingWeakness.description = weakness.details;
        }
        // Обновляем статус работы над слабостью
        if (weakness.workingOn !== undefined) {
          existingWeakness.workingOn = weakness.workingOn;
        }
      } else {
        // Добавляем новую слабую сторону
        user.weaknesses.push({
          title: weakness.title,
          description: weakness.details || '',
          workingOn: weakness.workingOn || false
        });
      }
    });
  }

  // Сохраняем обновления пользователя
  await user.save();

  res.status(201).json({
    success: true,
    data: report
  });
});

// @desc    Получение всех отчетов пользователя
// @route   GET /api/v1/reports
// @access  Private
exports.getReports = asyncHandler(async (req, res, next) => {
  // Базовый запрос к базе данных
  let query = {
    user: req.user.id
  };

  // Копируем req.query для добавления фильтров
  const reqQuery = { ...req.query };

  // Поля для исключения из фильтрации
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Удаляем поля из reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Фильтрация по типу отчета
  if (reqQuery.reportType) {
    query.reportType = reqQuery.reportType;
  }

  // Фильтрация по дате
  if (reqQuery.startDate && reqQuery.endDate) {
    query.date = {
      $gte: new Date(reqQuery.startDate),
      $lte: new Date(reqQuery.endDate)
    };
  } else if (reqQuery.startDate) {
    query.date = {
      $gte: new Date(reqQuery.startDate)
    };
  } else if (reqQuery.endDate) {
    query.date = {
      $lte: new Date(reqQuery.endDate)
    };
  }

  // Создание строки запроса
  let queryStr = JSON.stringify(query);

  // Создание операторов ($gt, $gte, $lt, $lte, $in)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Находим отчеты
  let reports = Report.find(JSON.parse(queryStr));

  // Выбор полей
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    reports = reports.select(fields);
  }

  // Сортировка
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    reports = reports.sort(sortBy);
  } else {
    reports = reports.sort('-date');
  }

  // Пагинация
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Report.countDocuments(JSON.parse(queryStr));

  reports = reports.skip(startIndex).limit(limit);

  // Выполнение запроса
  const results = await reports;

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

// @desc    Получение одного отчета
// @route   GET /api/v1/reports/:id
// @access  Private
exports.getReport = asyncHandler(async (req, res, next) => {
  const report = await Report.findById(req.params.id)
    .populate('taskStats.completed', 'title category difficulty')
    .populate('taskStats.failed', 'title category difficulty')
    .populate('taskStats.inProgress', 'title category difficulty');

  if (!report) {
    return next(new ErrorResponse(`Отчет с ID ${req.params.id} не найден`, 404));
  }

  // Проверка владельца отчета
  if (report.user.toString() !== req.user.id && req.user.role !== 'админ') {
    return next(new ErrorResponse('Нет доступа к этому отчету', 403));
  }

  res.status(200).json({
    success: true,
    data: report
  });
});

// @desc    Обновление отчета
// @route   PUT /api/v1/reports/:id
// @access  Private
exports.updateReport = asyncHandler(async (req, res, next) => {
  let report = await Report.findById(req.params.id);

  if (!report) {
    return next(new ErrorResponse(`Отчет с ID ${req.params.id} не найден`, 404));
  }

  // Проверка владельца отчета
  if (report.user.toString() !== req.user.id && req.user.role !== 'админ') {
    return next(new ErrorResponse('Нет доступа к этому отчету', 403));
  }

  // Поля, которые можно обновить
  const allowedUpdates = [
    'rating', 'mood', 'energyLevel', 'reflection', 
    'nextPeriodGoals', 'strengths', 'weaknesses'
  ];

  // Создаем объект с обновляемыми полями
  const updates = {};

  // Добавляем только разрешенные поля
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  // Обновление отчета
  report = await Report.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: report
  });
});

// @desc    Удаление отчета
// @route   DELETE /api/v1/reports/:id
// @access  Private
exports.deleteReport = asyncHandler(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(new ErrorResponse(`Отчет с ID ${req.params.id} не найден`, 404));
  }

  // Проверка владельца отчета
  if (report.user.toString() !== req.user.id && req.user.role !== 'админ') {
    return next(new ErrorResponse('Нет доступа к этому отчету', 403));
  }

  // Удаление отчета
  await report.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Получение аналитики по отчетам
// @route   GET /api/v1/reports/analytics
// @access  Private
exports.getReportAnalytics = asyncHandler(async (req, res, next) => {
  // Параметры периода для аналитики
  const { period, startDate, endDate } = req.query;

  let dateQuery = {};

  // Настраиваем фильтр по дате в зависимости от периода
  if (startDate && endDate) {
    dateQuery = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
  } else if (period === 'week') {
    // Последняя неделя
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    dateQuery = {
      date: {
        $gte: lastWeek
      }
    };
  } else if (period === 'month') {
    // Последний месяц
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    dateQuery = {
      date: {
        $gte: lastMonth
      }
    };
  } else if (period === 'year') {
    // Последний год
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    dateQuery = {
      date: {
        $gte: lastYear
      }
    };
  } else {
    // По умолчанию - последние 30 дней
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    dateQuery = {
      date: {
        $gte: last30Days
      }
    };
  }

  // Получаем отчеты за указанный период
  const reports = await Report.find({
    user: req.user.id,
    ...dateQuery
  }).sort('date');

  // Если отчетов нет
  if (reports.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        moodTrend: [],
        energyTrend: [],
        ratingTrend: [],
        taskCompletionRate: 0,
        categoryPerformance: {},
        skillsProgress: []
      }
    });
  }

  // Готовим данные для тенденций
  const moodTrend = reports.map(report => ({
    date: report.date,
    mood: report.mood
  }));

  const energyTrend = reports.map(report => ({
    date: report.date,
    energy: report.energyLevel
  }));

  const ratingTrend = reports.map(report => ({
    date: report.date,
    rating: report.rating
  }));

  // Рассчитываем процент выполнения задач
  let totalCompleted = 0;
  let totalFailed = 0;

  reports.forEach(report => {
    totalCompleted += report.taskStats.completedCount;
    totalFailed += report.taskStats.failedCount;
  });

  const totalTasks = totalCompleted + totalFailed;
  const taskCompletionRate = totalTasks > 0 
    ? Math.floor((totalCompleted / totalTasks) * 100) 
    : 0;

      // Анализируем производительность по категориям
      const categoryPerformance = {};
    
      reports.forEach(report => {
        for (const category in report.categoryStats) {
          if (!categoryPerformance[category]) {
            categoryPerformance[category] = {
              completed: 0,
              failed: 0,
              total: 0
            };
          }
          
          categoryPerformance[category].completed += report.categoryStats[category].completed;
          categoryPerformance[category].failed += report.categoryStats[category].failed;
          categoryPerformance[category].total += report.categoryStats[category].total;
        }
      });
      
      // Добавляем процентные показатели производительности
      for (const category in categoryPerformance) {
        const catStats = categoryPerformance[category];
        catStats.completionRate = catStats.total > 0 
          ? Math.floor((catStats.completed / catStats.total) * 100) 
          : 0;
      }
  
      // Обрабатываем данные о прогрессе навыков
      const skillsData = {};
      
      reports.forEach(report => {
        report.skillsProgress.forEach(skill => {
          if (!skillsData[skill.skill]) {
            skillsData[skill.skill] = 0;
          }
          
          skillsData[skill.skill] += skill.progress;
        });
      });
      
      // Преобразуем данные о навыках в массив
      const skillsProgress = Object.keys(skillsData).map(skill => ({
        skill,
        progress: Math.min(10, Math.floor(skillsData[skill] / reports.length))
      })).sort((a, b) => b.progress - a.progress);
  
      // Возвращаем аналитические данные
      res.status(200).json({
        success: true,
        data: {
          moodTrend,
          energyTrend,
          ratingTrend,
          taskCompletionRate,
          categoryPerformance,
          skillsProgress
        }
      });
  });