import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useLogger from '../hooks/useLogger';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const logger = useLogger('LoginPage');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      logger.info('Попытка входа в систему', { email });
      await login(email, password);
      logger.info('Вход выполнен успешно', { email });
      navigate('/');
    } catch (err: any) {
      logger.error('Ошибка входа', { error: err.message });
      setError(err.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Вход в систему</h1>
        <p className="text-muted-foreground text-sm">Введите данные для доступа к аккаунту</p>
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

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              placeholder="********"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-white rounded font-medium hover:bg-primary-hover transition-colors"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            <p>
              Нет аккаунта?{' '}
              <Link to="/register" className="text-primary hover:text-primary-hover">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 