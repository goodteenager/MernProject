import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Map, Sword, Scroll, Trophy, User, ShieldCheck, Backpack, 
  BarChart2, Settings, LogOut, Gem, Compass, Heart, Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Progress } from './ui/Progress.tsx';
import { Button } from './ui/Button.tsx';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar.tsx';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [healthValue, setHealthValue] = React.useState(85);
  const [manaValue, setManaValue] = React.useState(65);

  // Анимации для боковой панели
  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        when: "beforeChildren", 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Имитация регенерации здоровья и энергии
  React.useEffect(() => {
    const timer = setInterval(() => {
      setHealthValue(prev => Math.min(prev + 1, 100));
      setManaValue(prev => Math.min(prev + 2, 100));
    }, 10000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.aside 
      className="w-72 h-full backdrop-blur-sm bg-slate-900/80 text-slate-200 border-r border-slate-800/50 flex flex-col"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      {/* Заголовок */}
      <div className="p-6 border-b border-slate-800/50">
        <h1 className="text-2xl font-bold font-game bg-gradient-to-br from-amber-200 to-amber-400 bg-clip-text text-transparent">
          QuestManager
        </h1>
        <p className="text-xs text-slate-400 mt-1">Превращаем задачи в приключения</p>
      </div>
      
      {/* Информация о персонаже */}
      <motion.div 
        className="p-4 border-b border-slate-800/50"
        variants={itemVariants}
      >
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-3 ring-2 ring-amber-500/30 ring-offset-2 ring-offset-slate-900">
            <AvatarImage src={user?.avatar || "https://i.pravatar.cc/150?img=3"} />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <h2 className="font-bold text-slate-100">{user?.name || "Приключенец"}</h2>
              <span className="ml-2 px-1.5 py-0.5 bg-amber-500/20 rounded text-[10px] text-amber-300">
                Ур. {user?.level || 5}
              </span>
            </div>
            <p className="text-xs text-slate-400">{user?.characterClass || "Начинающий герой"}</p>
          </div>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center text-slate-400">
                <Heart className="h-3 w-3 mr-1 text-red-400" /> Здоровье
              </span>
              <span className="text-red-400">{healthValue}/100</span>
            </div>
            <Progress value={healthValue} max={100} variant="health" className="h-2" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center text-slate-400">
                <Zap className="h-3 w-3 mr-1 text-blue-400" /> Энергия
              </span>
              <span className="text-blue-400">{manaValue}/100</span>
            </div>
            <Progress value={manaValue} max={100} variant="mana" className="h-2" />
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs mb-2">
          <div className="flex items-center">
            <Gem className="h-3.5 w-3.5 mr-1 text-emerald-400" />
            <span className="text-emerald-300 font-bold">{user?.gold || 750}</span>
          </div>
          <div className="flex items-center">
            <Trophy className="h-3.5 w-3.5 mr-1 text-amber-400" />
            <span className="text-amber-300 font-bold">{user?.experience || 350}/{user?.nextLevelXp || 500} XP</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => window.location.href = '/character'}
        >
          Профиль персонажа
        </Button>
      </motion.div>
      
      {/* Навигация */}
      <motion.nav className="flex-1 p-4" variants={itemVariants}>
        <div className="text-xs uppercase font-semibold text-slate-500 mb-3 ml-2">Главное меню</div>
        <ul className="space-y-1">
          <NavItem to="/dashboard" icon={<Map />} label="Карта приключений" />
          <NavItem to="/quests" icon={<Scroll />} label="Журнал квестов" />
          <NavItem to="/battles" icon={<Sword />} label="Сражения" />
          <NavItem to="/achievements" icon={<Trophy />} label="Достижения" />
          <NavItem to="/inventory" icon={<Backpack />} label="Инвентарь" />
          <NavItem to="/character" icon={<User />} label="Персонаж" />
        </ul>
        
        <div className="text-xs uppercase font-semibold text-slate-500 mb-3 ml-2 mt-6">Дополнительно</div>
        <ul className="space-y-1">
          <NavItem to="/guild" icon={<ShieldCheck />} label="Гильдия" />
          <NavItem to="/stats" icon={<BarChart2 />} label="Статистика" />
          <NavItem to="/shop" icon={<Gem />} label="Магазин" />
          <NavItem to="/settings" icon={<Settings />} label="Настройки" />
        </ul>
      </motion.nav>
      
      {/* Текущее задание дня */}
      <motion.div className="p-4 border-t border-slate-800/50" variants={itemVariants}>
        <div className="text-xs uppercase font-semibold text-amber-500/80 mb-2 ml-1 flex items-center">
          <Compass className="h-3.5 w-3.5 mr-1" />
          Текущий квест
        </div>
        
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
          <h4 className="text-sm font-medium text-amber-300 mb-1">Завершить отчет о проекте</h4>
          <p className="text-xs text-slate-400 mb-2">Подготовить и отправить квартальный отчет для руководителя</p>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Награда: 50 XP</span>
            <Button variant="quest" size="sm" className="text-xs h-7 px-3">
              К заданию
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Кнопка выхода */}
      <motion.div className="p-4 border-t border-slate-800/50" variants={itemVariants}>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Покинуть приключение
        </Button>
      </motion.div>
    </motion.aside>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, badge }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex items-center p-2 rounded-lg transition-all",
            "hover:bg-slate-800/60 hover:text-amber-300",
            isActive 
              ? "bg-slate-800/80 text-amber-300 border-l-2 border-amber-400 pl-[calc(0.5rem-2px)]" 
              : "text-slate-300"
          )
        }
      >
        <div className={cn(
          "mr-3 h-5 w-5",
          // Дополнительные стили для иконки при необходимости
        )}>{icon}</div>
        {label}
        {badge !== undefined && (
          <div className="ml-auto bg-amber-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {badge}
          </div>
        )}
      </NavLink>
    </li>
  );
};
