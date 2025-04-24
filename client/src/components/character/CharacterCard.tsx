import React from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Путь может отличаться
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card.tsx';
import { Progress } from '../ui/Progress.tsx';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Avatar } from '../ui/Avatar.tsx';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const rarityClasses = cva('', {
  variants: {
    rarity: {
      common: 'border-slate-400',
      uncommon: 'border-green-400',
      rare: 'border-blue-400',
      epic: 'border-purple-400',
      legendary: 'border-amber-400',
    }
  },
  defaultVariants: {
    rarity: 'common'
  }
});

// Интерфейсы для статистики персонажа и снаряжения
export interface CharacterStats {
  strength: number;
  intelligence: number;
  dexterity: number;
  charisma: number;
  productivity: number;
}

export interface EquippedItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stats: Partial<CharacterStats>;
  iconUrl: string;
}

export interface CharacterProps {
  name: string;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  class: string;
  avatar: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stats: CharacterStats;
  equipped?: EquippedItem[];
  achievements?: number;
  badges?: { id: string; name: string; icon: string }[];
  onLevelUp?: () => void;
}

export function CharacterCard(props?: CharacterProps) {
  // Получаем данные из контекста аутентификации
  const { user } = useAuth();
  
  // Используем данные из пропсов если они есть, иначе из контекста
  const characterData = props || user?.character;
  
  // Проверяем наличие данных персонажа
  if (!characterData) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Загрузка персонажа...</p>
      </div>
    );
  }
  
  // Деструктурируем данные персонажа
  const {
    name,
    level,
    currentXp,
    xpToNextLevel,
    class: characterClass,
    avatar,
    health,
    maxHealth,
    mana,
    maxMana,
    stats,
    equipped = [],
    achievements = 0,
    badges = [],
    onLevelUp
  } = characterData;
  
  // Далее ваш обычный код, но с проверками на null/undefined
  
  return (
    <Card variant="character" className="w-full max-w-md animate-fadeIn">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar
              className={cn(
                "h-16 w-16 ring-2 ring-offset-2 ring-offset-black",
                level >= 30 ? "ring-amber-400" :
                  level >= 20 ? "ring-purple-400" :
                    level >= 10 ? "ring-blue-400" : "ring-slate-400"
              )}
            >
              <img src={avatar} alt={name} className="object-cover" />
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-slate-800 border-2 border-slate-700 rounded-full px-1.5 text-xs font-bold text-white">
              {level}
            </div>
          </div>
          <div>
            <CardTitle variant="default">{name}</CardTitle>
            <div className="text-sm text-slate-400 mt-1">
              {characterClass} • {achievements} Достижений
            </div>
            <div className="flex mt-2 space-x-1.5">
              {badges.slice(0, 3).map(badge => (
                <div key={badge.id} title={badge.name} className="h-6 w-6 rounded-full bg-slate-700 flex items-center justify-center">
                  <img src={badge.icon} alt={badge.name} className="h-4 w-4" />
                </div>
              ))}
              {badges.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300">
                  +{badges.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Progress
            variant="xp"
            value={currentXp}
            max={xpToNextLevel}
            showValue
            label="Опыт"
          />
          <div className="grid grid-cols-2 gap-2">
            <Progress
              variant="health"
              value={health}
              max={maxHealth}
              showValue
              label="Здоровье"
            />
            <Progress
              variant="mana"
              value={mana}
              max={maxMana}
              showValue
              label="Энергия"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-300">Характеристики</h4>
            <div className="space-y-1.5">
              {stats && Object.entries(stats).map(([key, val]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-slate-400">{key}</span>
                  <span className="text-slate-200">{val}</span>
                </div>
              ))}
              {!stats && (
                <div className="text-xs text-slate-500">
                  Нет доступных характеристик
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-300">Снаряжение</h4>
            {equipped.length > 0 ? (
              <div className="space-y-2">
                {equipped.map(item => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <div className={cn("h-8 w-8 rounded-md bg-slate-700/50 p-1 border",
                      rarityClasses({ rarity: item.rarity }))}>
                      <img src={item.iconUrl} alt={item.name} className="h-full w-full object-contain" />
                    </div>
                    <div className="text-xs">
                      <div className="font-medium text-slate-200">{item.name}</div>
                      <div className="text-slate-400">{item.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 h-full flex items-center justify-center">
                Нет экипированных предметов
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">Инвентарь</Button>
        <Button variant="quest" size="sm" onClick={onLevelUp} disabled={currentXp < xpToNextLevel}>
          {currentXp >= xpToNextLevel ? "Повысить уровень!" : "Выполняйте задачи"}
        </Button>
      </CardFooter>
    </Card>
  );
}