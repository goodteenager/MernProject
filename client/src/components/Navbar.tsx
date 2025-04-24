import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Space, Layout, Typography, Dropdown, Avatar, Menu } from 'antd';
import { 
  HomeOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  UserOutlined,
  DashboardOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const { Header } = Layout;
const { Text, Title } = Typography;

const NavBar: React.FC = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  // Не показывать навбар на страницах логина и регистрации
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const userMenu = (
    <Menu
      style={{ 
        minWidth: '180px',
        backgroundColor: theme === 'dark' ? '#1f1f1f' : 'white'
      }}
    >
      {isAdmin && (
        <Menu.Item key="admin" icon={<DashboardOutlined />}>
          <Link to="/logging">Настройки логирования</Link>
        </Menu.Item>
      )}
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/profile">Настройки профиля</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Выйти
      </Menu.Item>
    </Menu>
  );

  return (
    <Header 
      style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme === 'dark' ? '#141414' : '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: '64px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            style={{ 
              backgroundColor: '#1890ff',
              marginRight: '12px'
            }}
            size="large"
          >
            M
          </Avatar>
          <Title 
            level={4} 
            style={{ 
              margin: 0,
              color: theme === 'dark' ? 'white' : 'inherit'
            }}
          >
            MERN App
          </Title>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ThemeToggle />
        
        {isAuthenticated ? (
          <div style={{ marginLeft: '16px' }}>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Button
                type="text"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  height: '40px',
                  padding: '0 8px',
                  color: theme === 'dark' ? 'white' : 'inherit'
                }}
              >
                <Avatar 
                  style={{ 
                    backgroundColor: isAdmin ? '#ff4d4f' : '#1890ff',
                    marginRight: '8px'
                  }}
                  size="small"
                  icon={<UserOutlined />}
                />
                <span style={{ marginRight: '6px' }}>
                  {user?.username || 'Пользователь'}
                </span>
                <DownOutlined style={{ fontSize: '12px' }} />
              </Button>
            </Dropdown>
          </div>
        ) : (
          <Space style={{ marginLeft: '16px' }}>
            <Link to="/login">
              <Button type="primary">
                Войти
              </Button>
            </Link>
            <Link to="/register">
              <Button>
                Регистрация
              </Button>
            </Link>
          </Space>
        )}
      </div>
    </Header>
  );
};

export default NavBar; 