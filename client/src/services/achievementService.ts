import api from './api';
import { Achievement } from '../types/achievement';

export const achievementService = {
  // Получение всех достижений
  async getAchievements(filters?: any): Promise<{ data: Achievement[]; total: number; pagination: any }> {
    const response = await api.get('/achievements', { params: filters });
    return {
      data: response.data.data,
      total: response.data.total,
      pagination: response.data.pagination
    };
  },

  // Получение одного достижения
  async getAchievement(id: string): Promise<Achievement> {
    const response = await api.get(`/achievements/${id}`);
    return response.data.data;
  },

  // Получение достижений пользователя
  async getUserAchievements(): Promise<Achievement[]> {
    const response = await api.get('/achievements/user');
    return response.data.data;
  },

  // Проверка достижений пользователя
  async checkAchievements(): Promise<Achievement[]> {
    const response = await api.post('/achievements/check');
    return response.data.data;
  }
}; 