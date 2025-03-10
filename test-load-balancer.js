const axios = require('axios');

// Функция для выполнения запроса
async function makeRequest() {
  try {
    const response = await axios.get('http://localhost:5000/api/health');
    console.log(`Запрос обработан сервером: ${response.headers['x-backend-server'] || 'unknown'}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка:', error.message);
  }
}

// Создаем простой endpoint для проверки на сервере
// Этот код нужно добавить в server/index.js
/*
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    server: process.env.SERVER_ID || 'unknown',
    timestamp: new Date().toISOString()
  });
});
*/

// Выполняем серию запросов
async function runTest() {
  console.log('Проверка балансировки нагрузки:');
  for (let i = 0; i < 10; i++) {
    await makeRequest();
    // Небольшая задержка между запросами
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

runTest(); 