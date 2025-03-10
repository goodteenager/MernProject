import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import useLogger from '../hooks/useLogger';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const logger = useLogger('Layout');

  const handleLogout = () => {
    logger.info('Пользователь вышел из системы');
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Минималистичная навигационная панель */}
      <header className="border-b border-border bg-background py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-primary">MERN App</Link>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className={`text-sm ${location.pathname === '/' ? 'text-primary font-medium' : 'text-foreground'}`}
              >
                Главная
              </Link>
              
              {isAuthenticated && isAdmin && (
                <Link 
                  to="/admin" 
                  className={`text-sm ${location.pathname === '/admin' ? 'text-primary font-medium' : 'text-foreground'}`}
                >
                  Админ
                </Link>
              )}
            </nav>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2">
                    <span className="text-sm font-medium">{user?.username}</span>
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="text-sm px-3 py-1.5 bg-secondary rounded hover:bg-tertiary transition-colors"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link 
                    to="/login" 
                    className={`text-sm px-3 py-1.5 rounded transition-colors ${
                      location.pathname === '/login' 
                        ? 'bg-primary text-white' 
                        : 'bg-secondary hover:bg-tertiary'
                    }`}
                  >
                    Войти
                  </Link>
                  <Link 
                    to="/register"
                    className={`text-sm px-3 py-1.5 rounded transition-colors ${
                      location.pathname === '/register' 
                        ? 'bg-primary text-white' 
                        : 'bg-secondary hover:bg-tertiary'
                    }`}
                  >
                    Регистрация
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="flex-grow py-10">
        <div className="container mx-auto">
          {children}
        </div>
      </main>

      {/* Минималистичный футер */}
      <footer className="py-6 border-t border-border bg-background">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="text-primary font-medium">MERN App</Link>
              <p className="text-xs text-muted-foreground mt-1">Полнофункциональное приложение на стеке MERN</p>
            </div>
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} MERN Application с Docker
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 