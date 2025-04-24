import { useNavigate } from 'react-router-dom';
import { User, Bell, Moon, Sun, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar.tsx';
import { Button } from '../ui/Button.tsx';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="border-b bg-card z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Лого и название */}
        <div className="flex items-center space-x-3" onClick={() => navigate('/dashboard')} role="button">
          <span className="text-xl font-bold">Внутренний Путь</span>
        </div>

        {/* Правая часть с иконками */}
        <div className="flex items-center space-x-4">
          {/* Переключатель темы */}
          <Button variant="ghost" size="icon" onClick={handleThemeToggle} aria-label="Сменить тему">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Уведомления */}
          <Button variant="ghost" size="icon" onClick={() => navigate('/notifications')} aria-label="Уведомления">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Настройки */}
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} aria-label="Настройки">
            <Settings className="h-5 w-5" />
          </Button>

          {/* Аватар пользователя */}
          <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} className="rounded-full" aria-label="Профиль">
            <Avatar>
              <AvatarImage src={`/avatars/${user?.character.avatar}`} alt={user?.username || 'Пользователь'} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;