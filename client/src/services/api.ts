import axios from 'axios';

// Исправляем базовый URL, убираем лишнее /api/v1, так как это будет добавлено в proxy
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Создаем инстанс axios с базовыми настройками
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Временно отключим для тестирования
  // withCredentials: true, // Включаем передачу куки для аутентификации
});

// api.ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ответов
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Обработка ошибки авторизации (истекший токен)
    if (error.response && error.response.status === 401) {
      // Если не на странице авторизации, перенаправляем на логин
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;