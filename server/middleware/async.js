// Обертка для асинхронных функций для избежания try-catch блоков
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler; 