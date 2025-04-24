import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Award, 
  BarChart2, 
  User, 
  LogOut 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { CharacterCard } from '../character/CharacterCard';
import { Button } from '../ui/Button.tsx';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      label: 'Панель управления', 
      path: '/dashboard' 
    },
    { 
      icon: <Calendar className="h-5 w-5" />, 
      label: 'Задачи', 
      path: '/tasks' 
    },
    { 
      icon: <FileText className="h-5 w-5" />, 
      label: 'Рефлексия', 
      path: '/reports' 
    },
    { 
      icon: <BarChart2 className="h-5 w-5" />, 
      label: 'Аналитика', 
      path: '/analytics' 
    },
    { 
      icon: <Award className="h-5 w-5" />, 
      label: 'Достижения', 
      path: '/achievements' 
    },
    { 
      icon: <User className="h-5 w-5" />, 
      label: 'Профиль', 
      path: '/profile' 
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <aside 
      className={cn(
        "w-64 border-r bg-card p-4 flex flex-col", 
        className
      )}
    >
      {/* Карточка персонажа пользователя */}
      {user && <CharacterCard className="mb-6" />}

      {/* Навигационное меню */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex items-center w-full space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
              location.pathname === item.path 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-secondary"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Кнопка выхода */}
      <Button 
        variant="ghost" 
        className="mt-4 w-full justify-start text-muted-foreground" 
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-5 w-5" />
        <span>Выйти</span>
      </Button>
    </aside>
  );
};

export default Sidebar; 