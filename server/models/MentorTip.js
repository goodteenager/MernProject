const mongoose = require('mongoose');

const MentorTipSchema = new mongoose.Schema({
  // Текст подсказки/совета
  text: {
    type: String,
    required: [true, 'Текст подсказки обязателен'],
    trim: true,
    maxlength: [500, 'Текст подсказки не может быть длиннее 500 символов']
  },
  // Категория подсказки
  category: {
    type: String,
    enum: ['мотивация', 'продуктивность', 'эмоции', 'развитие', 'ежедневное', 'привычки', 'общее'],
    default: 'общее'
  },
  // Тип ситуации, в которой показывается подсказка
  situationType: {
    type: String,
    enum: [
      'приветствие', 'утро', 'вечер', 'выполнена задача', 'серия задач', 
      'провал задачи', 'новый уровень', 'низкая энергия', 'низкая мотивация',
      'стрик потерян', 'новая цель', 'долгое отсутствие', 'общее'
    ],
    default: 'общее'
  },
  // Условие для показа подсказки (например, дни стрика)
  condition: {
    parameter: {
      type: String,
      enum: [
        'tasksCompleted', 'streakDays', 'level', 'energy', 
        'mood', 'failedTasks', 'taskCategory', 'dayOfWeek'
      ],
      default: null
    },
    operator: {
      type: String,
      enum: ['=', '>', '<', '>=', '<=', 'между'],
      default: null
    },
    value: mongoose.Schema.Types.Mixed,
    value2: mongoose.Schema.Types.Mixed // Для оператора "между"
  },
  // Возможность персонализации подсказки (использовать имя пользователя и т.д.)
  personalized: {
    type: Boolean,
    default: false
  },
  // Вероятность показа этой подсказки (от 0 до 1, где 1 - показывать всегда при соответствии условию)
  probability: {
    type: Number,
    min: 0,
    max: 1,
    default: 1
  },
  // Активна ли подсказка
  isActive: {
    type: Boolean,
    default: true
  },
  // Тональность подсказки
  tone: {
    type: String,
    enum: ['позитивная', 'поддерживающая', 'вдохновляющая', 'наставляющая', 'шутливая', 'серьезная'],
    default: 'поддерживающая'
  },
  // Тэги для более точного подбора подсказок
  tags: [{
    type: String
  }],
  // Дата создания
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Индексация по категории и типу ситуации для быстрого поиска
MentorTipSchema.index({ category: 1, situationType: 1 });
MentorTipSchema.index({ tags: 1 });

module.exports = mongoose.model('MentorTip', MentorTipSchema); 