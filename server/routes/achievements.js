const express = require('express');
const router = express.Router();
const { 
  getAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getUserAchievements,
  checkAchievements
} = require('../controllers/achievements');
const { protect } = require('../middleware/auth');

// Защита всех маршрутов
router.use(protect);

// Маршруты для работы с достижениями пользователя
router.get('/user', getUserAchievements);
router.post('/check', checkAchievements);

// Маршруты для работы с достижениями
router.route('/')
  .get(getAchievements)
  .post(createAchievement);

// Маршруты для работы с конкретным достижением
router.route('/:id')
  .get(getAchievement)
  .put(updateAchievement)
  .delete(deleteAchievement);

module.exports = router; 