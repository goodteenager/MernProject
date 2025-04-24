import React, { useState, useEffect } from 'react';
import { Select, Switch, Space, Typography, Divider, Button, Table, Tag, message } from 'antd';
import { BugOutlined, InfoCircleOutlined, WarningOutlined, CloseCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import useLogger from '../hooks/useLogger';
import { useTheme } from '../contexts/ThemeContext';
import logger from '../services/logger';

const { Title, Paragraph, Text } = Typography;

const LoggingControl: React.FC = () => {
  const log = useLogger('LoggingControl');
  const { theme } = useTheme();
  const [logLevel, setLogLevel] = useState('info');
  const [enableConsole, setEnableConsole] = useState(true);
  
  // Используем реальные логи из logger
  const [logs, setLogs] = useState<any[]>([]);
  const [counter, setCounter] = useState(0);

  // Получаем текущие логи при монтировании и обновляем их каждую секунду
  useEffect(() => {
    // Начальная загрузка логов
    setLogs(logger.getHistory());
    
    // Устанавливаем интервал для обновления логов
    const intervalId = setInterval(() => {
      setLogs(logger.getHistory());
    }, 1000);
    
    // Очищаем интервал при размонтировании
    return () => clearInterval(intervalId);
  }, []);

  const handleLogLevelChange = (value: string) => {
    log.info(`Уровень логирования изменен на: ${value}`);
    setLogLevel(value);
  };

  const handleConsoleToggle = (checked: boolean) => {
    log.info(`Вывод в консоль ${checked ? 'включен' : 'выключен'}`);
    setEnableConsole(checked);
  };
  
  const handleClearLogs = () => {
    logger.clearHistory();
    setLogs([]);
    message.success('Журнал логов очищен');
    log.info('Журнал логов был очищен пользователем');
  };
  
  // В компоненте есть использование состояния counter для генерации разных типов логов
// Улучшенная версия функции handleCreateTestLog:

const handleCreateTestLog = () => {
  const newCounter = counter + 1;
  setCounter(newCounter);
  
  // Генерируем тестовые логи разных уровней
  switch (newCounter % 4) {
    case 0:
      log.info(`Тестовый информационный лог #${newCounter}`);
      break;
    case 1:
      log.warn(`Тестовое предупреждение #${newCounter}`);
      break;
    case 2:
      log.error(`Тестовая ошибка #${newCounter}`);
      break;
    case 3:
      log.debug(`Тестовый отладочный лог #${newCounter}`);
      break;
  }
};
  
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'debug':
        return <BugOutlined style={{ color: '#8c8c8c' }} />;
      case 'info':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      case 'warn':
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };
  
  const getLevelTag = (level: string) => {
    switch (level) {
      case 'debug':
        return <Tag color="default">DEBUG</Tag>;
      case 'info':
        return <Tag color="blue">INFO</Tag>;
      case 'warn':
      case 'warning':
        return <Tag color="orange">WARNING</Tag>;
      case 'error':
        return <Tag color="red">ERROR</Tag>;
      default:
        return <Tag color="blue">INFO</Tag>;
    }
  };
  
  const columns = [
    {
      title: 'Время',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => {
        const date = new Date(text);
        return <Text>{date.toLocaleTimeString()}</Text>;
      },
      width: '15%',
    },
    {
      title: 'Уровень',
      dataIndex: 'level',
      key: 'level',
      render: (text: string) => getLevelTag(text),
      width: '15%',
    },
    {
      title: 'Компонент',
      dataIndex: 'component',
      key: 'component',
      width: '20%',
    },
    {
      title: 'Сообщение',
      dataIndex: 'message',
      key: 'message',
    },
  ];

  return (
    <div 
      style={{ 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        background: theme === 'dark' ? '#1f1f1f' : 'white',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '16px 20px',
        background: theme === 'dark' ? '#141414' : '#f0f0f0',
        borderBottom: `1px solid ${theme === 'dark' ? '#303030' : '#e8e8e8'}`,
        color: theme === 'dark' ? 'white' : 'inherit'
      }}>
        <InfoCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
        <span style={{ fontWeight: 'bold' }}>Панель управления логированием</span>
      </div>
      
      <div style={{ padding: 20 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Title level={5} style={{ marginBottom: 16, color: theme === 'dark' ? 'white' : 'inherit' }}>
              Настройки логирования
            </Title>
            
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 250, flex: 1 }}>
                <Paragraph style={{ color: theme === 'dark' ? '#bbb' : 'inherit' }}>
                  Уровень логирования:
                </Paragraph>
                <Select
                  value={logLevel}
                  onChange={handleLogLevelChange}
                  style={{ width: '100%' }}
                  dropdownStyle={{ background: theme === 'dark' ? '#1f1f1f' : 'white' }}
                  options={[
                    { value: 'debug', label: 'Debug' },
                    { value: 'info', label: 'Info' },
                    { value: 'warn', label: 'Warning' },
                    { value: 'error', label: 'Error' }
                  ]}
                />
              </div>
              
              <div style={{ minWidth: 250, flex: 1 }}>
                <Paragraph style={{ color: theme === 'dark' ? '#bbb' : 'inherit' }}>
                  Вывод логов:
                </Paragraph>
                <Space>
                  <Switch 
                    checked={enableConsole} 
                    onChange={handleConsoleToggle} 
                    style={{ backgroundColor: enableConsole ? '#1890ff' : undefined }}
                  />
                  <Text style={{ color: theme === 'dark' ? '#bbb' : 'inherit' }}>
                    Выводить логи в консоль браузера
                  </Text>
                </Space>
              </div>
            </div>
            
            <div style={{ marginTop: 16 }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleCreateTestLog}
                style={{ marginRight: 8 }}
              >
                Создать тестовый лог
              </Button>
              <Text style={{ color: theme === 'dark' ? '#bbb' : 'inherit', marginLeft: 8 }}>
                Счетчик: {counter}
              </Text>
            </div>
          </div>
          
          <Divider style={{ margin: '16px 0' }} />
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0, color: theme === 'dark' ? 'white' : 'inherit' }}>
                Журнал логов
                <Text type="secondary" style={{ fontSize: 14, marginLeft: 8 }}>
                  ({logs.length} записей)
                </Text>
              </Title>
              <Button 
                icon={<DeleteOutlined />} 
                danger 
                ghost={theme === 'dark'} 
                size="small"
                onClick={handleClearLogs}
              >
                Очистить логи
              </Button>
            </div>
            
            <Table 
              columns={columns} 
              dataSource={logs.map((log, index) => ({ ...log, key: index }))}
              size="small" 
              pagination={{ pageSize: 10 }}
              style={{ 
                background: theme === 'dark' ? '#1f1f1f' : 'white',
              }}
              // Сортируем по времени в обратном порядке
              defaultSortOrder="descend"
              rowKey="timestamp"
              sortDirections={['descend', 'ascend']}
              // Если нет данных, показываем сообщение
              locale={{
                emptyText: 'Нет логов для отображения'
              }}
            />
          </div>
        </Space>
      </div>
    </div>
  );
};

export default LoggingControl;