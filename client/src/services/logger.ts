/**
 * Система логирования для фронтенда
 * Позволяет включать/выключать логирование
 */
class Logger {
  private enabled: boolean = true;
  private componentLogs: Map<string, boolean> = new Map();
  private logHistory: Array<{
    timestamp: string;
    level: string;
    component: string;
    message: string;
    data?: any;
  }> = [];

  constructor() {
    // Восстанавливаем состояние из localStorage, если есть
    const savedState = localStorage.getItem('logger_state');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        this.enabled = state.enabled;

        // Восстанавливаем состояние для отдельных компонентов
        if (state.componentLogs) {
          this.componentLogs = new Map(Object.entries(state.componentLogs));
        }
      } catch (e) {
        console.error('Ошибка при разборе сохраненного состояния логгера:', e);
      }
    }
  }

  /**
   * Включает логирование для всех или конкретного компонента
   */
  enable(component?: string): void {
    if (component) {
      this.componentLogs.set(component, true);
    } else {
      this.enabled = true;
    }
    this.saveState();
  }

  /**
   * Выключает логирование для всех или конкретного компонента
   */
  disable(component?: string): void {
    if (component) {
      this.componentLogs.set(component, false);
    } else {
      this.enabled = false;
    }
    this.saveState();
  }

  /**
   * Проверяет, включено ли логирование для компонента
   */
  isEnabled(component?: string): boolean {
    if (component && this.componentLogs.has(component)) {
      return this.componentLogs.get(component) as boolean;
    }
    return this.enabled;
  }

  /**
   * Сохраняет состояние логгера в localStorage
   */
  private saveState(): void {
    const state = {
      enabled: this.enabled,
      componentLogs: Object.fromEntries(this.componentLogs),
    };
    localStorage.setItem('logger_state', JSON.stringify(state));
  }

  /**
   * Добавляет запись в историю логов
   */
  private addToHistory(level: string, component: string, message: string, data?: any): void {
    this.logHistory.push({
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      data
    });

    // Ограничиваем размер истории
    if (this.logHistory.length > 1000) {
      this.logHistory = this.logHistory.slice(-1000);
    }
  }

  /**
   * Возвращает историю логов
   */
  getHistory(): Array<any> {
    return [...this.logHistory];
  }

  /**
   * Очищает историю логов
   */
  clearHistory(): void {
    this.logHistory = [];
  }

  /**
   * Логирование информационных сообщений
   */
  info(component: string, message: string, data?: any): void {
    if (!this.isEnabled(component)) return;

    console.info(`[INFO][${component}] ${message}`, data || '');
    this.addToHistory('info', component, message, data);
  }

  /**
   * Логирование предупреждений
   */
  warn(component: string, message: string, data?: any): void {
    if (!this.isEnabled(component)) return;

    console.warn(`[WARN][${component}] ${message}`, data || '');
    this.addToHistory('warn', component, message, data);
  }

  /**
   * Логирование ошибок
   */
  error(component: string, message: string, data?: any): void {
    if (!this.isEnabled(component)) return;

    console.error(`[ERROR][${component}] ${message}`, data || '');
    this.addToHistory('error', component, message, data);
  }

  /**
   * Логирование DEBUG сообщений
   */
  debug(component: string, message: string, data?: any): void {
    if (!this.isEnabled(component)) return;

    console.debug(`[DEBUG][${component}] ${message}`, data || '');
    this.addToHistory('debug', component, message, data);
  }

  /**
   * Логирование монтирования компонента
   */
  mounted(component: string): void {
    this.info(component, 'Компонент смонтирован');
  }

  /**
   * Логирование размонтирования компонента
   */
  unmounted(component: string): void {
    this.info(component, 'Компонент размонтирован');
  }
}

// Создаем единственный экземпляр логгера
const logger = new Logger();

export default logger;