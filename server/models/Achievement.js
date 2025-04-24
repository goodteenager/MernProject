const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  // Идентификатор достижения
  achievementId: {
    type: String,
    required: [true, 'Идентификатор достижения обязателен'],
    unique: true,
    trim: true
  },
  // Название достижения
  title: {
    type: String,
    required: [true, 'Название достижения обязательно'],
    trim: true,
    maxlength: [100, 'Название достижения не может быть длиннее 100 символов']
  },
  // Описание достижения
  description: {
    type: String,
    required: [true, 'Описание достижения обязательно'],
    trim: true,
    maxlength: [500, 'Описание достижения не может быть длиннее 500 символов']
  },
  // Путь к иконке достижения
  icon: {
    type: String,
    default: 'default_achievement.png'
  },
  // Категория достижения
  category: {
    type: String,
    enum: ['личное развитие', 'работа', 'отношения', 'здоровье', 'творчество', 'система', 'общее'],
    default: 'общее'
  },
  // Тип достижения
  type: {
    type: String,
    enum: ['однократное', 'прогрессивное', 'секретное', 'временное'],
    default: 'однократное'
  },
  // Для прогрессивных достижений: уровни достижения
  levels: [{
    level: Number,
    title: String,
    description: String,
    requirement: Number,
    reward: {
      experience: Number,
      energy: Number,
      worldElement: {
        type: String,
        enum: [null, 'дерево', 'цветок', 'камень', 'вода', 'дом', 'животное', 'свет'],
        default: null
      }
    }
  }],
  // Условие получения достижения
  condition: {
    // Параметр, который отслеживается
    parameter: {
      type: String,
      enum: [
        'tasksCompleted', 'streakDays', 'level', 'taskCategory', 
        'taskDifficulty', 'specificTask', 'loginDays', 'reflections'
      ],
      required: true
    },
    // Оператор условия
    operator: {
      type: String,
      enum: ['=', '>', '>='],
      default: '>='
    },
    // Значение для сравнения
    value: {
      type: Number,
      required: true
    },
    // Дополнительные условия (JSON-объект для сложных условий)
    additionalConditions: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  // Награда за получение достижения
  reward: {
    // Опыт, который получит пользователь
    experience: {
      type: Number,
      default: 50,
      min: 0
    },
    // Энергия, которую получит пользователь
    energy: {
      type: Number,
      default: 10,
      min: 0
    },
    // Элемент мира, который может получить пользователь
    worldElement: {
      type: String,
      enum: [null, 'дерево', 'цветок', 'камень', 'вода', 'дом', 'животное', 'свет'],
      default: null
    }
  },
  // Скрытое ли достижение (открывается только при получении)
  hidden: {
    type: Boolean,
    default: false
  },
  // Редкость достижения
  rarity: {
    type: String,
    enum: ['обычное', 'необычное', 'редкое', 'эпическое', 'легендарное'],
    default: 'обычное'
  },
  // Активно ли достижение
  isActive: {
    type: Boolean,
    default: true
  },
  // Дата создания
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Индексация по категории и редкости для быстрого поиска
AchievementSchema.index({ category: 1, rarity: 1 });
AchievementSchema.index({ achievementId: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', AchievementSchema); 