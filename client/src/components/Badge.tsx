import React from 'react';
import { cn } from '../lib/utils';
import { cva, type VariantProps } from "class-variance-authority";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
}

const badgeVariants = cva(
  "relative group flex flex-col items-center justify-center rounded-full cursor-help transition-all duration-300",
  {
    variants: {
      rarity: {
        common: "border-2 border-slate-400 bg-slate-700",
        uncommon: "border-2 border-green-400 bg-green-800/30",
        rare: "border-2 border-blue-400 bg-blue-800/30",
        epic: "border-2 border-purple-400 bg-purple-800/30",
        legendary: "border-2 border-amber-400 bg-amber-800/30"
      },
      size: {
        sm: "w-10 h-10",
        md: "w-14 h-14",
        lg: "w-20 h-20"
      },
      unlocked: {
        true: "shadow-md",
        false: "filter grayscale opacity-50 bg-slate-900 hover:opacity-70"
      }
    },
    defaultVariants: {
      rarity: "common",
      size: "md",
      unlocked: false
    },
  }
);

export function Badge({
  name,
  icon,
  description,
  rarity,
  unlocked,
  size = "md",
  className,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ rarity, size, unlocked }), className)} {...props}>
      {/* Иконка достижения */}
      <div className="p-2">
        <img src={icon} alt={name} className="w-full h-full object-contain" />
      </div>
      
      {/* Эффект свечения для редких достижений */}
      {unlocked && (rarity === 'epic' || rarity === 'legendary') && (
        <div className={cn(
          "absolute -inset-0.5 rounded-full blur opacity-40 z-0",
          rarity === 'epic' ? 'bg-purple-500' : 'bg-amber-500'
        )} />
      )}
      
      {/* Всплывающая подсказка */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300">
        <div className={cn(
          "text-sm font-bold mb-1",
          rarity === 'common' ? 'text-slate-300' :
          rarity === 'uncommon' ? 'text-green-400' :
          rarity === 'rare' ? 'text-blue-400' :
          rarity === 'epic' ? 'text-purple-400' : 'text-amber-400'
        )}>
          {name}
        </div>
        <div className="text-xs text-slate-400">{description}</div>
        <div className="mt-1 text-[10px] font-medium uppercase tracking-wide">
          {rarity === 'common' ? 'Обычное' :
           rarity === 'uncommon' ? 'Необычное' :
           rarity === 'rare' ? 'Редкое' :
           rarity === 'epic' ? 'Эпическое' : 'Легендарное'}
        </div>
        {!unlocked && (
          <div className="mt-1 text-[10px] text-slate-500">Не разблокировано</div>
        )}
        
        {/* Стрелка для всплывающей подсказки */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-800 border-r border-b border-slate-700 rotate-45"></div>
      </div>
    </div>
  );
}
