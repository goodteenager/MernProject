const express = require('express');
const router = express.Router();
const { 
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  failTask,
  postponeTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  getTodayTasks,
  updateTaskProgress
} = require('../controllers/tasks');
const { protect } = require('../middleware/auth');

// Защита всех маршрутов
router.use(protect);

// Маршруты для работы с задачами
router.route('/')
  .get(getTasks)
  .post(createTask);

// Специальный маршрут для сегодняшних задач
router.get('/today', getTodayTasks);

// Маршруты для работы с конкретной задачей
router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

// Маршруты для управления статусом задачи
router.put('/:id/complete', completeTask);
router.put('/:id/fail', failTask);
router.put('/:id/postpone', postponeTask);
router.put('/:id/progress', updateTaskProgress);

// Маршруты для работы с подзадачами
router.route('/:id/subtasks')
  .post(addSubtask);

router.route('/:id/subtasks/:subtaskId')
  .put(updateSubtask)
  .delete(deleteSubtask);

module.exports = router;