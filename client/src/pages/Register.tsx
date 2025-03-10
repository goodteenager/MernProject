import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useLogger from '../hooks/useLogger';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const logger = useLogger('RegisterPage');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      logger.info('Попытка регистрации', { email, username });
      await register(username, email, password);
      logger.info('Регистрация выполнена успешно', { email });
      navigate('/');
    } catch (err: any) {
      logger.error('Ошибка регистрации', { error: err.message });
      setError(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Создание аккаунта</h1>
        <p className="text-muted-foreground text-sm">Зарегистрируйтесь для доступа к приложению</p>
      </div>
      
      <div className="bg-card p-6 rounded shadow-sm border border-border">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border-l-4 border-destructive text-foreground rounded text-sm">
              <p className="font-medium">Ошибка</p>
              <p>{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="username">
              Имя пользователя
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              placeholder="username123"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              placeholder="email@example.com"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Минимум 6 символов"
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" htmlFor="confirmPassword">
              Подтверждение пароля
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Повторите пароль"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-white rounded font-medium hover:bg-primary-hover transition-colors"
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            <p>
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-primary hover:text-primary-hover">
                Войти в систему
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 