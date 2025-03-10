import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import LoggingControl from '../components/LoggingControl';
import useLogger from '../hooks/useLogger';

const Home: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const logger = useLogger('HomePage');
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    logger.info('Кнопка увеличения счетчика нажата');
    setCount((count) => count + 1);
  };

  // Для неавторизованных пользователей - минималистичный лендинг
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">MERN Stack Application</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Современное веб-приложение на стеке MongoDB, Express, React и Node.js с Docker-контейнеризацией
          </p>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-card p-6 rounded border border-border">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium mb-2">Безопасная аутентификация</h2>
            <p className="text-sm text-muted-foreground">JWT-токены для безопасного доступа с разделением ролей пользователей</p>
          </div>
          
          <div className="bg-card p-6 rounded border border-border">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium mb-2">Темная тема</h2>
            <p className="text-sm text-muted-foreground">Переключение между светлой и темной темой с сохранением выбора</p>
          </div>
          
          <div className="bg-card p-6 rounded border border-border">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-lg font-medium mb-2">Продвинутое логирование</h2>
            <p className="text-sm text-muted-foreground">Система логирования активности пользователей с детальной историей</p>
          </div>
        </section>
        
        <div className="flex justify-center gap-4">
          <Link 
            to="/login" 
            className="px-5 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors"
          >
            Войти в систему
          </Link>
          <Link 
            to="/register" 
            className="px-5 py-2 bg-secondary text-foreground rounded hover:bg-tertiary transition-colors"
          >
            Регистрация
          </Link>
        </div>
      </div>
    );
  }

  // Для авторизованных пользователей - с сохранением счетчика
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Панель управления</h1>
      
      {/* Счетчик - восстановлен */}
      <div className="bg-card p-6 rounded border border-border mb-6 text-center">
        <h2 className="text-lg font-medium mb-4">Интерактивный счетчик</h2>
        <div className="text-6xl font-bold mb-6 bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center text-primary mx-auto">
          {count}
        </div>
        <button 
          onClick={handleIncrement}
          className="px-4 py-2 bg-primary text-white rounded text-sm hover:bg-primary-hover transition-colors"
        >
          Увеличить счетчик
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-card p-6 rounded border border-border">
          <h2 className="text-lg font-medium mb-4">Активность пользователя</h2>
          <p className="text-muted-foreground mb-4">
            Просмотр и управление логами действий пользователя в системе
          </p>
          <button className="px-4 py-2 bg-primary text-white rounded text-sm hover:bg-primary-hover transition-colors">
            Открыть логи
          </button>
        </div>
        
        <div className="bg-card p-6 rounded border border-border">
          <h2 className="text-lg font-medium mb-4">Управление задачами</h2>
          <p className="text-muted-foreground mb-4">
            Создание и управление задачами в системе
          </p>
          <button className="px-4 py-2 bg-primary text-white rounded text-sm hover:bg-primary-hover transition-colors">
            Перейти к задачам
          </button>
        </div>
      </div>
      
      {/* Панель администратора с просмотром логов - восстановлена */}
      {isAdmin && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Панель администратора</h2>
          <div className="bg-card rounded border border-border overflow-hidden">
            <div className="bg-secondary/50 p-4 border-b border-border">
              <h3 className="font-medium">Управление логированием</h3>
            </div>
            <LoggingControl />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 