const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Пожалуйста, укажите название задачи'],
      trim: true,
      minlength: [3, 'Название задачи должно быть не менее 3 символов'],
      maxlength: [100, 'Название задачи не может быть длиннее 100 символов']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Описание задачи не может быть длиннее 500 символов']
    },
    status: {
      type: String,
      enum: ['запланирована', 'в процессе', 'выполнена', 'отложена', 'провалена'],
      default: 'запланирована'
    },
    priority: {
      type: String,
      enum: ['низкий', 'средний', 'высокий', 'критический'],
      default: 'средний'
    },
    category: {
      type: String,
      enum: ['личное развитие', 'работа', 'отношения', 'здоровье', 'творчество'],
      required: [true, 'Пожалуйста, укажите категорию задачи']
    },
    taskType: {
      type: String,
      enum: ['ежедневная', 'долгосрочная', 'привычка', 'босс'],
      default: 'ежедневная'
    },
    reward: {
      experience: {
        type: Number,
        default: 10,
        min: 0
      },
      energy: {
        type: Number,
        default: 5,
        min: -20,
        max: 20
      },
      achievement: {
        type: String,
        default: null
      },
      worldElement: {
        type: String,
        enum: [null, 'дерево', 'цветок', 'камень', 'вода', 'дом', 'животное', 'свет'],
        default: null
      }
    },
    difficulty: {
      type: String,
      enum: ['очень легкая', 'легкая', 'средняя', 'сложная', 'очень сложная'],
      default: 'средняя'
    },
    repeatDays: {
      type: [String],
      enum: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
      default: []
    },
    reminderTime: {
      type: String,
      validate: {
        validator: function(v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: 'Время должно быть в формате ЧЧ:ММ'
      },
      default: null
    },
    dueDate: {
      type: Date
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    reflection: {
      mood: {
        type: String,
        enum: ['отлично', 'хорошо', 'нейтрально', 'плохо', 'ужасно', null],
        default: null
      },
      notes: {
        type: String,
        maxlength: [300, 'Заметки не могут быть длиннее 300 символов'],
        default: ''
      },
      completedAt: {
        type: Date,
        default: null
      },
      perceivedDifficulty: {
        type: String,
        enum: ['легче чем ожидалось', 'как ожидалось', 'сложнее чем ожидалось', null],
        default: null
      }
    },
    streak: {
      type: Number,
      default: 0,
      min: 0
    },
    maxStreak: {
      type: Number,
      default: 0,
      min: 0
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    subtasks: [{
      title: {
        type: String,
        required: true,
        trim: true
      },
      completed: {
        type: Boolean,
        default: false
      },
      dueDate: {
        type: Date
      }
    }],
    skills: [{
      type: String,
      enum: [
        'концентрация', 'творчество', 'дисциплина', 'общение', 
        'физическая активность', 'ментальное здоровье', 'продуктивность',
        'эмоциональный интеллект', 'знания', 'стрессоустойчивость'
      ]
    }],
    history: [{
      date: {
        type: Date,
        default: Date.now
      },
      completed: {
        type: Boolean,
        default: false
      },
      notes: String
    }],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    adaptiveDifficulty: {
      type: Boolean,
      default: false
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  { timestamps: true }
);

TaskSchema.methods.calculateExperience = function() {
  const baseExperience = this.reward.experience;
  const difficultyMultipliers = {
    'очень легкая': 0.5,
    'легкая': 0.75,
    'средняя': 1,
    'сложная': 1.5,
    'очень сложная': 2
  };
  
  return Math.floor(baseExperience * difficultyMultipliers[this.difficulty]);
};

TaskSchema.methods.calculateEnergy = function() {
  const baseEnergy = this.reward.energy;
  const difficultyMultipliers = {
    'очень легкая': 1.25,
    'легкая': 1,
    'средняя': 0.75,
    'сложная': 0.5,
    'очень сложная': 0.25
  };
  
  return Math.floor(baseEnergy * difficultyMultipliers[this.difficulty]);
};

TaskSchema.pre('save', function(next) {
  if (this.isModified('difficulty') && !this.isModified('reward.experience')) {
    const difficultyExp = {
      'очень легкая': 5,
      'легкая': 10,
      'средняя': 20,
      'сложная': 30,
      'очень сложная': 50
    };
    
    this.reward.experience = difficultyExp[this.difficulty];
  }
  
  if (this.taskType === 'босс') {
    this.reward.experience = Math.floor(this.reward.experience * 2.5);
    this.reward.energy = Math.floor(this.reward.energy * 1.5);
  }
  
  next();
});

TaskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'выполнена' && this.taskType === 'привычка') {
    this.streak += 1;
    
    if (this.streak > this.maxStreak) {
      this.maxStreak = this.streak;
    }
    
    this.history.push({
      date: Date.now(),
      completed: true
    });
  } 
  else if (this.isModified('status') && this.status === 'провалена' && this.taskType === 'привычка') {
    this.streak = 0;
    
    this.history.push({
      date: Date.now(),
      completed: false
    });
  }
  
  next();
});

TaskSchema.index({ user: 1, category: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Task', TaskSchema);