const express = require('express');
const router = express.Router();
const { 
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
  getReportAnalytics
} = require('../controllers/reports');
const { protect } = require('../middleware/auth');

// Защита всех маршрутов
router.use(protect);

// Маршрут для аналитики
router.get('/analytics', getReportAnalytics);

// Маршруты для работы с отчетами
router.route('/')
  .get(getReports)
  .post(createReport);

// Маршруты для работы с конкретным отчетом
router.route('/:id')
  .get(getReport)
  .put(updateReport)
  .delete(deleteReport);

module.exports = router; 