const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout,
  getMe, 
  updateDetails, 
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updateCharacter,
  updateSettings,
  getUserStats
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

// Маршруты регистрации и входа
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// Маршруты управления профилем
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

// Маршруты сброса пароля
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);

// Маршрут подтверждения email
router.get('/verify-email/:token', verifyEmail);

// Маршруты обновления персонажа и настроек
router.put('/character', protect, updateCharacter);
router.put('/settings', protect, updateSettings);

// Маршрут получения статистики
router.get('/stats', protect, getUserStats);

module.exports = router;