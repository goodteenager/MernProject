import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Progress } from '../ui/Progress.tsx';
import { Card, CardContent } from '../ui/Card.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar.tsx';
import { User, Battery, BarChart2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CharacterSummaryProps {
  className?: string;
}

export const CharacterSummary: React.FC<CharacterSummaryProps> = ({ className }) => {
  const { user } = useAuth();
  
  // Если бы данные были бы реальными, они бы приходили из контекста
  // Здесь используются примерные данные
  const character = {
    name: user?.name || 'Приключенец',
    level: user?.level || 5,
    class: user?.characterClass || 'Начинающий герой',
    currentXp: user?.currentXp || 350,
    xpToNextLevel: user?.xpToNextLevel || 500,
    health: user?.health || 85,
    maxHealth: user?.maxHealth || 100,
    mana: user?.energy || 70,
    maxMana: user?.maxEnergy || 100,
    avatar: user?.avatar || 'https://i.pravatar.cc/150?img=3',
    stats: {
      strength: user?.stats?.strength || 8,
      intelligence: user?.stats?.intelligence || 12,
      dexterity: user?.stats?.dexterity || 10,
      charisma: user?.stats?.charisma || 9,
      productivity: user?.stats?.productivity || 15
    },
    achievements: user?.achievements?.length || 12,
    tasks: {
      completed: user?.stats?.completedTasks || 42,
      active: user?.stats?.activeTasks || 3
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between space-x-6">
        {/* Основная информация о персонаже */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-offset-slate-900 ring-amber-500/50">
              <AvatarImage src={character.avatar} alt={character.name} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-slate-800 border-2 border-slate-700 rounded-full px-1.5 text-xs font-bold text-amber-400">
              {character.level}
            </div>
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white">{character.name}</h3>
              <span className="text-xs text-slate-400">{character.class}</span>
            </div>
            
            <div className="text-xs text-slate-400 mt-1">
              {character.achievements} достижений • {character.tasks.completed} заданий выполнено
            </div>
            
            <div className="mt-1.5">
              <Progress
                variant="xp"
                value={character.currentXp}
                max={character.xpToNextLevel}
                label="Опыт"
                showValue
                className="h-2.5 w-48"
              />
            </div>
          </div>
        </div>
        
        {/* Показатели здоровья и энергии */}
        <div className="flex space-x-2">
          <div className="w-32">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 flex items-center">
                <Battery className="h-3 w-3 mr-1 text-red-400" />
                Здоровье
              </span>
              <span className="text-slate-300">{character.health}/{character.maxHealth}</span>
            </div>
            <Progress
              variant="health"
              value={character.health}
              max={character.maxHealth}
              className="h-2"
            />
          </div>
          
          <div className="w-32">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 flex items-center">
                <Battery className="h-3 w-3 mr-1 text-blue-400" />
                Энергия
              </span>
              <span className="text-slate-300">{character.mana}/{character.maxMana}</span>
            </div>
            <Progress
              variant="mana"
              value={character.mana}
              max={character.maxMana}
              className="h-2"
            />
          </div>
        </div>
        
        {/* Характеристики */}
        <div className="grid grid-cols-5 gap-3 bg-slate-800/40 backdrop-blur-sm px-3 py-2 rounded-md">
          <StatDisplay 
            name="СИЛ" 
            value={character.stats.strength} 
            color="text-red-400"
          />
          <StatDisplay 
            name="ИНТ" 
            value={character.stats.intelligence} 
            color="text-blue-400"
          />
          <StatDisplay 
            name="ЛОВ" 
            value={character.stats.dexterity} 
            color="text-green-400"
          />
          <StatDisplay 
            name="ХАР" 
            value={character.stats.charisma} 
            color="text-purple-400"
          />
          <StatDisplay 
            name="ПРОД" 
            value={character.stats.productivity} 
            color="text-amber-400"
          />
        </div>
        
        {/* Активные задания */}
        <div>
          <div className="flex items-center space-x-1 mb-1">
            <BarChart2 className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-medium text-slate-300">Активные квесты</span>
          </div>
          <div className="flex space-x-2">
            {character.tasks.active > 0 ? (
              Array(character.tasks.active).fill(0).map((_, i) => (
                <div key={i} className="w-3 h-3 bg-amber-500/60 rounded-full"></div>
              ))
            ) : (
              <span className="text-xs text-slate-500">Нет активных квестов</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatDisplayProps {
  name: string;
  value: number;
  color?: string;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ name, value, color = "text-white" }) => {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] text-slate-400 font-medium">{name}</span>
      <span className={cn("text-sm font-bold font-stats", color)}>{value}</span>
    </div>
  );
};
