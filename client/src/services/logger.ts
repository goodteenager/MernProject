/**
 * Система логирования для фронтенда
 * Позволяет включать/выключать логирование
 */
import { message as messageApi } from 'antd';

interface LogEntry {
  timestamp: string;
  level: string;
  component: string;
  message: string;
}

class Logger {
  private static instance: Logger;
  private history: LogEntry[] = [];
  private enabled = true;
  private consoleEnabled = true;
  private maxHistorySize = 1000; // Ограничение размера истории логов

  // Приватный конструктор для реализации паттерна Singleton
  private constructor() {}

  // Метод для получения экземпляра логгера
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Включение/выключение логирования
  public enable(enabled: boolean): void {
    this.enabled = enabled;
  }

  // Включение/выключение вывода в консоль
  public enableConsole(enabled: boolean): void {
    this.consoleEnabled = enabled;
  }

  // Добавление записи в историю логов
  private addToHistory(level: string, component: string, message: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
    };
    
    // Добавляем запись в начало массива для более простой сортировки
    this.history.unshift(entry);
    
    // Ограничиваем размер истории
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(0, this.maxHistorySize);
    }
  }

  // Получение истории логов
  public getHistory(): LogEntry[] {
    return [...this.history];
  }

  // Очистка истории логов
  public clearHistory(): void {
    this.history = [];
  }

  // Лог информационного сообщения
  public info(component: string, message: string): void {
    if (!this.enabled) return;
    
    this.addToHistory('info', component, message);
    
    if (this.consoleEnabled) {
      console.info(`[INFO][${component}] ${message}`);
    }
  }

  // Лог предупреждения
  public warn(component: string, message: string): void {
    if (!this.enabled) return;
    
    this.addToHistory('warn', component, message);
    
    if (this.consoleEnabled) {
      console.warn(`[WARN][${component}] ${message}`);
    }
  }

  // Лог ошибки
  public error(component: string, message: string, showNotification = false): void {
    if (!this.enabled) return;
    
    this.addToHistory('error', component, message);
    
    if (this.consoleEnabled) {
      console.error(`[ERROR][${component}] ${message}`);
    }
    
    // Опционально показываем всплывающее уведомление
    if (showNotification) {
      messageApi.error(`[${component}] ${message}`);
    }
  }

  // Лог отладочной информации
  public debug(component: string, message: string): void {
    if (!this.enabled) return;
    
    this.addToHistory('debug', component, message);
    
    if (this.consoleEnabled) {
      console.debug(`[DEBUG][${component}] ${message}`);
    }
  }

  // Лог монтирования компонента
  public componentDidMount(component: string): void {
    this.debug(component, 'Component mounted');
  }

  // Лог размонтирования компонента
  public componentWillUnmount(component: string): void {
    this.debug(component, 'Component will unmount');
  }
}

// Экспортируем единственный экземпляр
const logger = Logger.getInstance();
export default logger;