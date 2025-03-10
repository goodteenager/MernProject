import React, { useState, useEffect } from 'react';
import logger from '../services/logger';

const LoggingControl: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(logger.isEnabled());
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [logs, setLogs] = useState<any[]>([]);

  
  useEffect(() => {
    setIsEnabled(logger.isEnabled());
  }, []);

  // Обработчики включения/выключения логирования
  const handleToggle = () => {
    if (isEnabled) {
      logger.disable();
    } else {
      logger.enable();
    }
    setIsEnabled(!isEnabled);
  };

  // Загрузка истории логов
  const handleShowHistory = () => {
    setLogs(logger.getHistory());
    setShowHistory(!showHistory);
  };

  // Очистка истории логов
  const handleClearHistory = () => {
    logger.clearHistory();
    setLogs([]);
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          className={`px-3 py-1.5 rounded text-sm ${isEnabled ? 'bg-destructive text-white' : 'bg-primary text-white'}`}
          onClick={handleToggle}
        >
          {isEnabled ? 'Выключить логирование' : 'Включить логирование'}
        </button>

        <button
          className="px-3 py-1.5 bg-secondary rounded text-sm"
          onClick={handleShowHistory}
        >
          {showHistory ? 'Скрыть историю' : 'Показать историю логов'}
        </button>

        {showHistory && logs.length > 0 && (
          <button
            className="px-3 py-1.5 bg-secondary text-destructive rounded text-sm"
            onClick={handleClearHistory}
          >
            Очистить историю
          </button>
        )}
      </div>

      {showHistory && logs.length > 0 && (
        <div className="border rounded overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Время</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Уровень</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Компонент</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Сообщение</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log, index) => (
                  <tr key={index} className="hover:bg-secondary/10">
                    <td className="px-4 py-2 text-sm">{log.timestamp}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        log.level === 'error' ? 'bg-destructive/10 text-destructive' :
                        log.level === 'warn' ? 'bg-yellow-500/10 text-yellow-600' :
                        log.level === 'info' ? 'bg-primary/10 text-primary' :
                        'bg-secondary text-muted-foreground'
                      }`}>
                        {log.level.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">{log.component}</td>
                    <td className="px-4 py-2 text-sm">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showHistory && logs.length === 0 && (
        <div className="p-4 text-center bg-secondary/10 rounded border border-border mt-4">
          <p className="text-muted-foreground">История логов пуста</p>
        </div>
      )}
    </div>
  );
};

export default LoggingControl;