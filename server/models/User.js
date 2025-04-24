const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Схема пользователя для проекта "Внутренний Путь"
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Пожалуйста, укажите имя пользователя'],
    unique: true,
    trim: true,
    minlength: [3, 'Имя пользователя должно содержать не менее 3 символов'],
    maxlength: [20, 'Имя пользователя должно содержать не более 20 символов']
  },
  email: {
    type: String,
    required: [true, 'Пожалуйста, укажите email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Пожалуйста, укажите корректный email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Пожалуйста, укажите пароль'],
    minlength: [6, 'Пароль должен быть не менее 6 символов'],
    select: false
  },
  // Добавляем новые поля для персонажа пользователя
  character: {
    mood: {
      type: String,
      enum: ['отлично', 'хорошо', 'нейтрально', 'плохо', 'ужасно'],
      default: 'нейтрально'
    },
    energy: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    },
    // Уровень прогресса персонажа
    level: {
      type: Number,
      default: 1,
      min: 1
    },
    experience: {
      type: Number,
      default: 0,
      min: 0
    },
    // Опыт, необходимый для перехода на следующий уровень
    experienceToNextLevel: {
      type: Number,
      default: 100,
      min: 100
    },
    // Внешний вид персонажа
    avatar: {
      type: String,
      default: 'default_avatar.png'
    },
    // Визуальное окружение персонажа (тип мира)
    worldType: {
      type: String, 
      enum: ['сад', 'лес', 'горы', 'море', 'пустыня'],
      default: 'сад'
    },
    // Элементы мира, разблокированные пользователем
    worldElements: [{
      type: String,
      enum: ['дерево', 'цветок', 'камень', 'вода', 'дом', 'животное', 'свет']
    }]
  },
  // Статистика и аналитика
  statistics: {
    tasksCompleted: {
      type: Number,
      default: 0,
      min: 0
    },
    streakDays: {
      type: Number,
      default: 0,
      min: 0
    },
    maxStreakDays: {
      type: Number,
      default: 0,
      min: 0
    },
    lastActivityDate: {
      type: Date,
      default: Date.now
    },
    categoriesStats: {
      личноеРазвитие: {
        completed: { type: Number, default: 0 },
        failed: { type: Number, default: 0 }
      },
      работа: {
        completed: { type: Number, default: 0 },
        failed: { type: Number, default: 0 }
      },
      отношения: {
        completed: { type: Number, default: 0 },
        failed: { type: Number, default: 0 }
      },
      здоровье: {
        completed: { type: Number, default: 0 },
        failed: { type: Number, default: 0 }
      },
      творчество: {
        completed: { type: Number, default: 0 },
        failed: { type: Number, default: 0 }
      }
    }
  },
  // Достижения пользователя
  achievements: [{
    title: String,
    description: String,
    dateEarned: {
      type: Date,
      default: Date.now
    },
    icon: String,
    // Уникальный идентификатор достижения
    achievementId: String
  }],
  // Личные сильные стороны пользователя
  strengths: [{
    title: String,
    description: String,
    level: {
      type: Number,
      default: 1,
      min: 1,
      max: 10
    }
  }],
  // Личные слабые стороны пользователя
  weaknesses: [{
    title: String,
    description: String,
    workingOn: {
      type: Boolean,
      default: false
    }
  }],
  // Настройки профиля
  settings: {
    // Уведомления
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      dailyReminder: {
        type: Boolean,
        default: true
      },
      reminderTime: {
        type: String,
        default: '09:00'
      }
    },
    // Тема интерфейса
    theme: {
      type: String,
      enum: ['светлая', 'тёмная', 'системная'],
      default: 'системная'
    },
    // Язык
    language: {
      type: String,
      enum: ['русский', 'английский'],
      default: 'русский'
    }
  },
  // Роль пользователя
  role: {
    type: String,
    enum: ['пользователь', 'админ'],
    default: 'пользователь'
  },
  // Токен сброса пароля
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // Верификация email
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  // Дата создания аккаунта
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Последний вход
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Хэширование пароля перед сохранением
userSchema.pre('save', async function(next) {
  // Если пароль не изменен, переходим дальше
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Генерируем соль
    const salt = await bcrypt.genSalt(10);
    // Хэшируем пароль
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Проверка стрика пользователя при активности
userSchema.pre('save', function(next) {
  // Если дата последней активности не изменена, пропускаем
  if (!this.isModified('statistics.lastActivityDate')) {
    return next();
  }
  
  // Проверяем дату последней активности
  const now = new Date();
  const lastActivity = new Date(this.statistics.lastActivityDate);
  
  // Обнуляем время для корректного сравнения дат
  now.setHours(0, 0, 0, 0);
  lastActivity.setHours(0, 0, 0, 0);
  
  // Если последняя активность была вчера, увеличиваем стрик
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (lastActivity.getTime() === yesterday.getTime()) {
    this.statistics.streakDays += 1;
    
    // Обновляем максимальный стрик, если текущий его превысил
    if (this.statistics.streakDays > this.statistics.maxStreakDays) {
      this.statistics.maxStreakDays = this.statistics.streakDays;
    }
  } 
  // Если активность была раньше чем вчера, сбрасываем стрик
  else if (lastActivity.getTime() < yesterday.getTime()) {
    this.statistics.streakDays = 1;
  }
  
  next();
});

// Проверка уровня персонажа при получении опыта
userSchema.pre('save', function(next) {
  // Если опыт не изменен, пропускаем
  if (!this.isModified('character.experience')) {
    return next();
  }
  
  // Проверяем, нужно ли повысить уровень
  while (this.character.experience >= this.character.experienceToNextLevel) {
    // Повышаем уровень
    this.character.level += 1;
    
    // Вычитаем опыт, необходимый для этого уровня
    this.character.experience -= this.character.experienceToNextLevel;
    
    // Увеличиваем количество опыта для следующего уровня
    // Формула: nextLevelExp = currentLevelExp * 1.5
    this.character.experienceToNextLevel = Math.floor(this.character.experienceToNextLevel * 1.5);
  }
  
  next();
});

// Метод для сравнения паролей
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Метод для генерации токена сброса пароля
userSchema.methods.getResetPasswordToken = function() {
  // Генерируем случайный токен
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Хэшируем токен и сохраняем в БД
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  // Устанавливаем срок действия токена (10 минут)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

// Метод для генерации токена подтверждения email
userSchema.methods.getEmailVerificationToken = function() {
  // Генерируем случайный токен
  const verificationToken = crypto.randomBytes(20).toString('hex');
  
  // Хэшируем токен и сохраняем в БД
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  // Устанавливаем срок действия токена (24 часа)
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;
  
  return verificationToken;
};

// Метод для добавления опыта персонажу
userSchema.methods.addExperience = function(amount) {
  this.character.experience += amount;
  return this.character.experience;
};

// Метод для изменения энергии персонажа
userSchema.methods.changeEnergy = function(amount) {
  this.character.energy = Math.max(0, Math.min(100, this.character.energy + amount));
  return this.character.energy;
};

// Метод для получения прогресса опыта в процентах
userSchema.methods.getExperienceProgress = function() {
  return Math.floor((this.character.experience / this.character.experienceToNextLevel) * 100);
};

// Метод для получения статистики прогресса по категориям
userSchema.methods.getCategoriesProgress = function() {
  const result = {};
  
  for (const category in this.statistics.categoriesStats) {
    const stats = this.statistics.categoriesStats[category];
    const total = stats.completed + stats.failed;
    
    result[category] = {
      completed: stats.completed,
      failed: stats.failed,
      total: total,
      progress: total > 0 ? Math.floor((stats.completed / total) * 100) : 0
    };
  }
  
  return result;
};

module.exports = mongoose.model('User', userSchema);