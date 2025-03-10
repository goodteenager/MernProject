const express = require('express');
const path = require('path');
const fs = require('fs');
const { readFileAsync, readFileSync } = require('../utils/fileReader');

const router = express.Router();

// Создаем тестовый файл для демонстрации
const createTestFile = () => {
  const testFilePath = path.join(__dirname, '../data/testFile.txt');

  // Создаем директорию, если её нет
  if (!fs.existsSync(path.join(__dirname, '../data'))) {
    fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
  }

  // Создаем тестовый файл с большим объемом данных
  if (!fs.existsSync(testFilePath)) {
    let data = '';
    for (let i = 0; i < 100000; i++) {
      data += `Строка ${i}: Это тестовые данные для демонстрации асинхронного чтения файла\n`;
    }
    fs.writeFileSync(testFilePath, data);
    console.log('Тестовый файл создан');
  }

  return testFilePath;
};

// Демонстрация асинхронного чтения файла
router.get('/async', async (req, res, next) => {
  try {
    console.time('asyncRead');

    const testFilePath = createTestFile();

    // Используем промис для асинхронного чтения
    const startTime = Date.now();
    const fileContent = await readFileAsync(testFilePath);
    const endTime = Date.now();

    console.timeEnd('asyncRead');

    res.status(200).json({
      success: true,
      message: 'Файл успешно прочитан асинхронно',
      executionTime: `${endTime - startTime} мс`,
      fileSize: `${fileContent.length} байт`,
      preview: fileContent.substring(0, 200) + '...'
    });
  } catch (error) {
    next(error);
  }
});

// Демонстрация синхронного чтения файла (НЕ РЕКОМЕНДУЕТСЯ!)
router.get('/sync', (req, res, next) => {
  try {
    console.time('syncRead');

    const testFilePath = createTestFile();

    // Используем синхронное чтение (блокирует Event Loop)
    const startTime = Date.now();
    const fileContent = readFileSync(testFilePath);
    const endTime = Date.now();

    console.timeEnd('syncRead');

    res.status(200).json({
      success: true,
      message: 'Файл успешно прочитан синхронно (блокирующий способ)',
      executionTime: `${endTime - startTime} мс`,
      fileSize: `${fileContent.length} байт`,
      preview: fileContent.substring(0, 200) + '...',
      warning: 'Этот метод блокирует Event Loop и не рекомендуется для использования!'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;