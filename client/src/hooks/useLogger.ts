import { useEffect } from 'react';
import logger from '../services/logger';

/**
 * Хук для логирования жизненного цикла компонента
 * @param componentName Имя компонента
 */
const useLogger = (componentName: string) => {
  useEffect(() => {
    // Логируем монтирование компонента
    logger.componentDidMount(componentName);

    // Логируем размонтирование компонента при удалении
    return () => {
      logger.componentWillUnmount(componentName);
    };
  }, [componentName]);

  // Возвращаем объект логгера для использования внутри компонента
  return {
    log: (message: string, data?: any) => logger.info(componentName, message),
    info: (message: string, data?: any) => logger.info(componentName, message),
    warn: (message: string, data?: any) => logger.warn(componentName, message),
    error: (message: string, data?: any) => logger.error(componentName, message),
    debug: (message: string, data?: any) => logger.debug(componentName, message),
  };
};

export default useLogger;