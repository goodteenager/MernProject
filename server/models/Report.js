const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    // Пользователь, которому принадлежит отчет
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    // Дата отчета
    date: {
      type: Date,
      default: Date.now
    },
    // Тип отчета: ежедневный, еженедельный, ежемесячный
    reportType: {
      type: String,
      enum: ['ежедневный', 'еженедельный', 'ежемесячный'],
      default: 'ежедневный'
    },
    // Оценка дня/недели/месяца пользователем (от 1 до 10)
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Пожалуйста, оцените период']
    },
    // Настроение пользователя в течение периода
    mood: {
      type: String,
      enum: ['отлично', 'хорошо', 'нейтрально', 'плохо', 'ужасно'],
      required: [true, 'Пожалуйста, укажите ваше настроение']
    },
    // Уровень энергии в конце периода
    energyLevel: {
      type: Number,
      min: 0,
      max: 100,
      required: [true, 'Пожалуйста, укажите ваш уровень энергии']
    },
    // Статистика по задачам
    taskStats: {
      // Выполненные задачи за период
      completed: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Task'
      }],
      // Количество выполненных задач
      completedCount: {
        type: Number,
        default: 0
      },
      // Невыполненные задачи
      failed: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Task'
      }],
      // Количество невыполненных задач
      failedCount: {
        type: Number,
        default: 0
      },
      // Задачи в процессе
      inProgress: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Task'
      }],
      // Количество задач в процессе
      inProgressCount: {
        type: Number,
        default: 0
      },
      // Процент выполнения задач
      completionRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      }
    },
    // Статистика по категориям
    categoryStats: {
      личноеРазвитие: {
        completed: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      работа: {
        completed: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      отношения: {
        completed: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      здоровье: {
        completed: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      творчество: {
        completed: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      }
    },
    // Достижения за период
    achievements: [{
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      icon: String
    }],
    // Рефлексия о периоде
    reflection: {
      // Что было хорошего
      positive: {
        type: String,
        maxlength: [500, 'Рефлексия не может быть длиннее 500 символов']
      },
      // Что было плохого
      negative: {
        type: String,
        maxlength: [500, 'Рефлексия не может быть длиннее 500 символов']
      },
      // Выводы и уроки
      lessons: {
        type: String,
        maxlength: [500, 'Рефлексия не может быть длиннее 500 символов']
      }
    },
    // Цели на следующий период
    nextPeriodGoals: [{
      title: {
        type: String,
        required: true,
        maxlength: [100, 'Цель не может быть длиннее 100 символов']
      },
      category: {
        type: String,
        enum: ['личное развитие', 'работа', 'отношения', 'здоровье', 'творчество']
      }
    }],
    // Заметки о сильных сторонах
    strengths: [{
      title: {
        type: String,
        required: true,
        maxlength: [100, 'Заметка не может быть длиннее 100 символов']
      },
      details: String
    }],
    // Заметки о слабых сторонах
    weaknesses: [{
      title: {
        type: String, 
        required: true,
        maxlength: [100, 'Заметка не может быть длиннее 100 символов']
      },
      details: String,
      workingOn: {
        type: Boolean,
        default: false
      }
    }],
    // Прогресс по навыкам
    skillsProgress: [{
      skill: {
        type: String,
        required: true,
        enum: [
          'концентрация', 'творчество', 'дисциплина', 'общение', 
          'физическая активность', 'ментальное здоровье', 'продуктивность',
          'эмоциональный интеллект', 'знания', 'стрессоустойчивость'
        ]
      },
      progress: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
      }
    }],
    // Общий прогресс за период (рассчитывается на основе завершенных задач и оценки)
    overallProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    // Советы от "наставника"
    mentorTips: [{
      tip: String,
      category: {
        type: String,
        enum: ['мотивация', 'продуктивность', 'эмоции', 'развитие', 'общее']
      }
    }]
  },
  { timestamps: true }
);

// Метод для расчета общего прогресса
ReportSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('taskStats.completed') || this.isModified('rating')) {
    // Расчет процента выполненных задач
    const totalTasks = this.taskStats.completedCount + this.taskStats.failedCount;
    this.taskStats.completionRate = totalTasks > 0 
      ? Math.floor((this.taskStats.completedCount / totalTasks) * 100) 
      : 0;
    
    // Расчет общего прогресса (учитывая задачи и субъективную оценку)
    const taskWeight = 0.7; // 70% веса для задач
    const ratingWeight = 0.3; // 30% веса для оценки
    
    this.overallProgress = Math.floor(
      (this.taskStats.completionRate * taskWeight) + 
      ((this.rating / 10) * 100 * ratingWeight)
    );
  }
  
  // Обработка статистики по категориям
  for (const category in this.categoryStats) {
    const catStats = this.categoryStats[category];
    catStats.total = catStats.completed + catStats.failed;
  }
  
  next();
});

// Индексация для быстрого поиска отчетов пользователя
ReportSchema.index({ user: 1, date: -1 });
// Индексация по типу отчета
ReportSchema.index({ reportType: 1 });

module.exports = mongoose.model('Report', ReportSchema); 