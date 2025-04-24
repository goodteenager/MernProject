export interface Report {
  _id: string;
  user: string;
  date: string;
  reportType: 'ежедневный' | 'еженедельный' | 'ежемесячный';
  rating: number;
  mood: 'отлично' | 'хорошо' | 'нейтрально' | 'плохо' | 'ужасно';
  energyLevel: number;
  taskStats: {
    completed: string[] | Task[];
    completedCount: number;
    failed: string[] | Task[];
    failedCount: number;
    inProgress: string[] | Task[];
    inProgressCount: number;
    completionRate: number;
  };
  categoryStats: {
    личноеРазвитие: { completed: number; failed: number; total: number };
    работа: { completed: number; failed: number; total: number };
    отношения: { completed: number; failed: number; total: number };
    здоровье: { completed: number; failed: number; total: number };
    творчество: { completed: number; failed: number; total: number };
  };
  achievements: {
    title: string;
    description: string;
    icon: string;
  }[];
  reflection: {
    positive: string;
    negative: string;
    lessons: string;
  };
  nextPeriodGoals: {
    title: string;
    category?: string;
  }[];
  strengths: {
    title: string;
    details?: string;
  }[];
  weaknesses: {
    title: string;
    details?: string;
    workingOn: boolean;
  }[];
  skillsProgress: {
    skill: string;
    progress: number;
  }[];
  overallProgress: number;
  mentorTips: {
    tip: string;
    category: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  category: string;
  difficulty: string;
}

export interface ReportCreateData {
  reportType?: 'ежедневный' | 'еженедельный' | 'ежемесячный';
  rating: number;
  mood: string;
  energyLevel: number;
  positive?: string;
  negative?: string;
  lessons?: string;
  nextPeriodGoals?: { title: string; category?: string }[];
  strengths?: { title: string; details?: string }[];
  weaknesses?: { title: string; details?: string; workingOn?: boolean }[];
}

export interface ReportUpdateData {
  rating?: number;
  mood?: string;
  energyLevel?: number;
  reflection?: {
    positive?: string;
    negative?: string;
    lessons?: string;
  };
  nextPeriodGoals?: { title: string; category?: string }[];
  strengths?: { title: string; details?: string }[];
  weaknesses?: { title: string; details?: string; workingOn?: boolean }[];
} 