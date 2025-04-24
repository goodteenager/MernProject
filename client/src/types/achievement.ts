export interface Achievement {
  _id: string;
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  type: 'однократное' | 'прогрессивное' | 'секретное' | 'временное';
  levels?: {
    level: number;
    title: string;
    description: string;
    requirement: number;
    reward: {
      experience: number;
      energy: number;
      worldElement: string | null;
    };
  }[];
  condition?: {
    parameter: string;
    operator: string;
    value: number;
    additionalConditions?: any;
  };
  reward: {
    experience: number;
    energy: number;
    worldElement: string | null;
  };
  hidden: boolean;
  rarity: 'обычное' | 'необычное' | 'редкое' | 'эпическое' | 'легендарное';
  isActive: boolean;
  createdAt: string;
  isEarned?: boolean;
  dateEarned?: string;
} 