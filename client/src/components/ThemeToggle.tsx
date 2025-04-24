import React from 'react';
import { Button, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Tooltip title={`Переключить на ${theme === 'dark' ? 'светлую' : 'темную'} тему`}>
      <Button
        type="default"
        icon={theme === 'dark' ? <BulbOutlined /> : <BulbFilled />}
        onClick={toggleTheme}
        size="large"
        shape="circle"
      />
    </Tooltip>
  );
};

export default ThemeToggle; 