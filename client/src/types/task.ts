export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'запланирована' | 'в процессе' | 'выполнена' | 'отложена' | 'провалена';
  priority: 'низкий' | 'средний' | 'высокий' | 'критический';
  category: 'личное развитие' | 'работа' | 'отношения' | 'здоровье' | 'творчество';
  taskType: 'ежедневная' | 'долгосрочная' | 'привычка' | 'босс';
  reward: {
    experience: number;
    energy: number;
    achievement: string | null;
    worldElement: string | null;
  };
  difficulty: 'очень легкая' | 'легкая' | 'средняя' | 'сложная' | 'очень сложная';
  repeatDays: ('пн' | 'вт' | 'ср' | 'чт' | 'пт' | 'сб' | 'вс')[];
  reminderTime: string | null;
  dueDate: string | null;
  startDate: string;
  reflection: {
    mood: 'отлично' | 'хорошо' | 'нейтрально' | 'плохо' | 'ужасно' | null;
    notes: string;
    completedAt: string | null;
    perceivedDifficulty: 'легче чем ожидалось' | 'как ожидалось' | 'сложнее чем ожидалось' | null;
  };
  streak: number;
  maxStreak: number;
  progress: number;
  subtasks: Subtask[];
  skills: string[];
  history: {
    date: string;
    completed: boolean;
    notes: string;
  }[];
  user: string;
  adaptiveDifficulty: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  _id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface TaskCreateData {
  title: string;
  description?: string;
  category: string;
  taskType?: string;
  priority?: string;
  difficulty?: string;
  dueDate?: string;
  repeatDays?: string[];
  skills?: string[];
  tags?: string[];
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  category?: string;
  taskType?: string;
  difficulty?: string;
  dueDate?: string | null;
  repeatDays?: string[];
  skills?: string[];
  tags?: string[];
  adaptiveDifficulty?: boolean;
  progress?: number;
}

export interface SubtaskData {
  title: string;
  dueDate?: string;
}

export interface TaskReflectionData {
  mood?: string;
  notes?: string;
  perceivedDifficulty?: string;
} 