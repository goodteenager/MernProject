import api from './api';
import { User, AuthResponse, RegisterData, LoginData } from '../types/user';

export const authService = {
  async register(userData: RegisterData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Вход пользователя
  async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Выход пользователя
  async logout(): Promise<void> {
    await api.get('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Получение профиля пользователя
  async getProfile(): Promise<User> {
    const response = await api.get<{ success: boolean; data: User }>('/auth/me');
    return response.data.data;
  },

  // Обновление данных профиля
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.put<{ success: boolean; data: User }>('/auth/updatedetails', userData);
    return response.data.data;
  },

  // Обновление пароля
  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/auth/updatepassword', { currentPassword, newPassword });
  },

  // Обновление персонажа
  async updateCharacter(characterData: Partial<User['character']>): Promise<User['character']> {
    const response = await api.put<{ success: boolean; data: User['character'] }>(
      '/auth/character',
      characterData
    );
    return response.data.data;
  },

  // Обновление настроек
  async updateSettings(settingsData: Partial<User['settings']>): Promise<User['settings']> {
    const response = await api.put<{ success: boolean; data: User['settings'] }>(
      '/auth/settings',
      settingsData
    );
    return response.data.data;
  },

  // Получение статистики пользователя
  async getUserStats(): Promise<any> {
    const response = await api.get('/auth/stats');
    return response.data.data;
  },

  // Запрос сброса пароля
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>('/auth/forgotpassword', { email });
    return response.data;
  },

  // Сброс пароля
  async resetPassword(token: string, password: string): Promise<void> {
    await api.put(`/auth/resetpassword/${token}`, { password });
  },

  // Проверка авторизации пользователя
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  // Получение текущего пользователя из localStorage
  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};