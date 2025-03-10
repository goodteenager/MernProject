const fs = require('fs');
const path = require('path');

/**
 * Неблокирующая операция чтения файла.
 * Использует fs.readFile() асинхронно, чтобы не блокировать Event Loop.
 */
const readFileAsync = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

/**
 * Пример блокирующей операции чтения файла (для сравнения).
 * НЕ РЕКОМЕНДУЕТСЯ использовать в продакшене!
 */
const readFileSync = (filePath) => {
  return fs.readFileSync(filePath, 'utf8');
};

module.exports = {
  readFileAsync,
  readFileSync
};