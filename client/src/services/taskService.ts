import api from './api';
import { Task, TaskCreateData, TaskUpdateData, SubtaskData } from '../types/task';

export const taskService = {
  // Получение всех задач пользователя
  async getTasks(filters?: any): Promise<{ data: Task[]; total: number; pagination: any }> {
    const response = await api.get('/api/v1/tasks', { params: filters });
    return {
      data: response.data.data,
      total: response.data.total,
      pagination: response.data.pagination
    };
  },

  // Получение одной задачи
  async getTask(id: string): Promise<Task> {
    const response = await api.get(`/api/v1/tasks/${id}`);
    return response.data.data;
  },

  // Создание новой задачи
  async createTask(taskData: TaskCreateData): Promise<Task> {
    const response = await api.post('/api/v1/tasks', taskData);
    return response.data.data;
  },

  // Обновление задачи
  async updateTask(id: string, taskData: TaskUpdateData): Promise<Task> {
    const response = await api.put(`/api/v1/tasks/${id}`, taskData);
    return response.data.data;
  },

  // Удаление задачи
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/api/v1/tasks/${id}`);
  },

  // Выполнение задачи
  async completeTask(id: string, reflectionData?: any): Promise<any> {
    const response = await api.put(`/api/v1/tasks/${id}/complete`, reflectionData);
    return response.data;
  },

  // Отметка задачи как невыполненной
  async failTask(id: string, reflectionData?: any): Promise<any> {
    const response = await api.put(`/api/v1/tasks/${id}/fail`, reflectionData);
    return response.data;
  },

  // Откладывание задачи
  async postponeTask(id: string, dueDate: string): Promise<Task> {
    const response = await api.put(`/api/v1/tasks/${id}/postpone`, { dueDate });
    return response.data.data;
  },

  // Обновление прогресса задачи
  async updateTaskProgress(id: string, progress: number, reflectionData?: any): Promise<Task> {
    const response = await api.put(`/api/v1/tasks/${id}/progress`, { progress, ...reflectionData });
    return response.data.data;
  },

  // Получение задач на сегодня
  async getTodayTasks(): Promise<Task[]> {
    const response = await api.get('/api/v1/tasks/today');
    return response.data.data;
  },

  // Добавление подзадачи
  async addSubtask(taskId: string, subtaskData: SubtaskData): Promise<Task> {
    const response = await api.post(`/api/v1/tasks/${taskId}/subtasks`, subtaskData);
    return response.data.data;
  },

  // Обновление подзадачи
  async updateSubtask(taskId: string, subtaskId: string, subtaskData: Partial<SubtaskData>): Promise<Task> {
    const response = await api.put(`/api/v1/tasks/${taskId}/subtasks/${subtaskId}`, subtaskData);
    return response.data.data;
  },

  // Удаление подзадачи
  async deleteSubtask(taskId: string, subtaskId: string): Promise<Task> {
    const response = await api.delete(`/api/v1/tasks/${taskId}/subtasks/${subtaskId}`);
    return response.data.data;
  }
}; 