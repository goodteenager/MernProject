import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout as AntLayout, Menu, Button, Space, Dropdown } from "antd";
import { 
  UserOutlined, 
  LogoutOutlined, 
  LoginOutlined, 
  UserAddOutlined,
  MenuOutlined,
  BulbOutlined,
  BulbFilled
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const { Header, Content, Footer } = AntLayout;

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      type="text" 
      icon={theme === 'dark' ? <BulbOutlined /> : <BulbFilled />} 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    />
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Профиль
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Выйти
      </Menu.Item>
    </Menu>
  );

  return (
    <AntLayout className="min-h-screen">
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/">
            <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>
              MERN App
            </h1>
          </Link>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            style={{ marginLeft: 20 }}
          >
            <Menu.Item key="/">
              <Link to="/">Главная</Link>
            </Menu.Item>
            <Menu.Item key="/dashboard">
              <Link to="/dashboard">Панель</Link>
            </Menu.Item>
          </Menu>
        </div>
        
        <Space>
          <ThemeToggle />
          
          {isAuthenticated ? (
            <Dropdown overlay={userMenu} trigger={['click']}>
              <Button type="text" style={{ color: 'white' }}>
                <Space>
                  <UserOutlined />
                  {user?.username}
                </Space>
              </Button>
            </Dropdown>
          ) : (
            <Space>
              <Button 
                type={location.pathname === '/login' ? 'primary' : 'text'} 
                icon={<LoginOutlined />}
              >
                <Link to="/login">Войти</Link>
              </Button>
              <Button 
                type={location.pathname === '/register' ? 'primary' : 'text'} 
                icon={<UserAddOutlined />}
              >
                <Link to="/register">Регистрация</Link>
              </Button>
            </Space>
          )}
        </Space>
      </Header>

      <Content style={{ padding: '24px 50px' }}>
        <div className="container">{children}</div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        MERN Stack Application ©{new Date().getFullYear()} Created with Ant Design
      </Footer>
    </AntLayout>
  );
};

export default Layout; 