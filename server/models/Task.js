const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Пожалуйста, укажите название задачи'],
      trim: true,
      maxlength: [100, 'Название задачи не может быть длиннее 100 символов'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Описание задачи не может быть длиннее 500 символов'],
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'completed'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);