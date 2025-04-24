import api from './api';
import { Report, ReportCreateData, ReportUpdateData } from '../types/report';

export const reportService = {
  // Получение всех отчетов пользователя
  async getReports(filters?: any): Promise<{ data: Report[]; total: number; pagination: any }> {
    const response = await api.get('/reports', { params: filters });
    return {
      data: response.data.data,
      total: response.data.total,
      pagination: response.data.pagination
    };
  },

  // Получение одного отчета
  async getReport(id: string): Promise<Report> {
    const response = await api.get(`/reports/${id}`);
    return response.data.data;
  },

  // Создание нового отчета
  async createReport(reportData: ReportCreateData): Promise<Report> {
    const response = await api.post('/reports', reportData);
    return response.data.data;
  },

  // Обновление отчета
  async updateReport(id: string, reportData: ReportUpdateData): Promise<Report> {
    const response = await api.put(`/reports/${id}`, reportData);
    return response.data.data;
  },

  // Удаление отчета
  async deleteReport(id: string): Promise<void> {
    await api.delete(`/reports/${id}`);
  },

  // Получение аналитики по отчетам
  async getReportAnalytics(params?: any): Promise<any> {
    const response = await api.get('/reports/analytics', { params });
    return response.data.data;
  }
}; 