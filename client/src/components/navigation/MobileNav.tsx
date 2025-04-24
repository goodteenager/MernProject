import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Award, 
  BarChart2 
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface MobileNavProps {
  className?: string;
}

const MobileNav = ({ className }: MobileNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      icon: <LayoutDashboard className="h-6 w-6" />, 
      label: 'Главная', 
      path: '/dashboard' 
    },
    { 
      icon: <Calendar className="h-6 w-6" />, 
      label: 'Задачи', 
      path: '/tasks' 
    },
    { 
      icon: <FileText className="h-6 w-6" />, 
      label: 'Отчеты', 
      path: '/reports' 
    },
    { 
      icon: <BarChart2 className="h-6 w-6" />, 
      label: 'Аналитика', 
      path: '/analytics' 
    },
    { 
      icon: <Award className="h-6 w-6" />, 
      label: 'Награды', 
      path: '/achievements' 
    }
  ];

  return (
    <nav className={cn("fixed bottom-0 left-0 right-0 border-t bg-card z-20", className)}>
      <div className="flex justify-around">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center py-3 px-2 flex-1",
              location.pathname === item.path 
                ? "text-primary" 
                : "text-muted-foreground"
            )}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav; 