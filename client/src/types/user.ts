export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  character: {
    mood: 'отлично' | 'хорошо' | 'нейтрально' | 'плохо' | 'ужасно';
    energy: number;
    level: number;
    experience: number;
    experienceToNextLevel: number;
    avatar: string;
    worldType: 'сад' | 'лес' | 'горы' | 'море' | 'пустыня';
    worldElements: string[];
  };
  statistics: {
    tasksCompleted: number;
    streakDays: number;
    maxStreakDays: number;
    lastActivityDate: string;
    categoriesStats: {
      личноеРазвитие: { completed: number; failed: number };
      работа: { completed: number; failed: number };
      отношения: { completed: number; failed: number };
      здоровье: { completed: number; failed: number };
      творчество: { completed: number; failed: number };
    };
  };
  achievements: {
    achievementId: string;
    title: string;
    description: string;
    dateEarned: string;
    icon: string;
  }[];
  strengths: {
    title: string;
    description: string;
    level: number;
  }[];
  weaknesses: {
    title: string;
    description: string;
    workingOn: boolean;
  }[];
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
      dailyReminder: boolean;
      reminderTime: string;
    };
    theme: 'светлая' | 'тёмная' | 'системная';
    language: 'русский' | 'английский';
  };
  createdAt: string;
  lastLogin: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
} 