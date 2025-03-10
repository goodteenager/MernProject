import { useEffect } from 'react';
import logger from '../services/logger.ts';

/**
 * Хук для логирования жизненного цикла компонента
 * @param componentName Имя компонента
 */
const useLogger = (componentName: string) => {
  useEffect(() => {
    // Логируем монтирование компонента
    logger.mounted(componentName);

    // Логируем размонтирование компонента при удалении
    return () => {
      logger.unmounted(componentName);
    };
  }, [componentName]);

  // Возвращаем объект логгера для использования внутри компонента
  return {
    log: (message: string, data?: any) => logger.info(componentName, message, data),
    info: (message: string, data?: any) => logger.info(componentName, message, data),
    warn: (message: string, data?: any) => logger.warn(componentName, message, data),
    error: (message: string, data?: any) => logger.error(componentName, message, data),
    debug: (message: string, data?: any) => logger.debug(componentName, message, data),
  };
};

export default useLogger;