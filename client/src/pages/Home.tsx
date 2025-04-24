import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Row, Col, Button, Divider, Card, Badge, Space, Tabs } from 'antd';
import {
  SafetyOutlined,
  BulbOutlined,
  CheckSquareOutlined,
  PlusOutlined,
  LineChartOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LoggingControl from '../components/LoggingControl';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const Home: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { theme } = useTheme();
  const [count, setCount] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const cardStyle = (index: number) => ({
    height: '100%',
    border: '1px solid #eee',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'box-shadow 0.3s',
    boxShadow: hoveredCard === index ? '0 4px 8px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.1)',
    background: theme === 'dark' ? '#1f1f1f' : 'white',
    color: theme === 'dark' ? 'white' : 'inherit'
  });

  // Неаутентифицированный интерфейс (главная страница)
  if (!isAuthenticated) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        padding: '40px 16px',
        minHeight: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Title level={1} style={{ fontWeight: 'bold', marginBottom: '20px' }}>
          MERN Stack Application
        </Title>

        <Paragraph style={{
          fontSize: '1.2rem',
          maxWidth: '700px',
          margin: '0 auto 40px',
          color: theme === 'dark' ? '#bbb' : '#666'
        }}>
          Современное веб-приложение на стеке MongoDB, Express, React и Node.js с Docker-контейнеризацией
        </Paragraph>

        <Divider style={{ margin: '32px 0' }} />

        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <div
              style={cardStyle(0)}
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{
                textAlign: 'center',
                padding: '36px 0',
                background: theme === 'dark' ? '#2d2d2d' : '#f9f9f9'
              }}>
                <SafetyOutlined style={{ fontSize: 56, color: theme === 'dark' ? '#1890ff' : '#1890ff' }} />
              </div>
              <div style={{ padding: '24px' }}>
                <h2 style={{ marginTop: 0, fontWeight: 'bold' }}>Безопасность</h2>
                <p style={{ color: theme === 'dark' ? '#bbb' : '#666', fontSize: '16px' }}>
                  JWT-аутентификация и разделение ролей администраторов и пользователей.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div
              style={cardStyle(1)}
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{
                textAlign: 'center',
                padding: '36px 0',
                background: theme === 'dark' ? '#2d2d2d' : '#f9f9f9'
              }}>
                <BulbOutlined style={{ fontSize: 56, color: theme === 'dark' ? '#faad14' : '#faad14' }} />
              </div>
              <div style={{ padding: '24px' }}>
                <h2 style={{ marginTop: 0, fontWeight: 'bold' }}>Темная тема</h2>
                <p style={{ color: theme === 'dark' ? '#bbb' : '#666', fontSize: '16px' }}>
                  Поддержка светлой и темной темы для комфортной работы с приложением.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div
              style={cardStyle(2)}
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{
                textAlign: 'center',
                padding: '36px 0',
                background: theme === 'dark' ? '#2d2d2d' : '#f9f9f9'
              }}>
                <CheckSquareOutlined style={{ fontSize: 56, color: theme === 'dark' ? '#52c41a' : '#52c41a' }} />
              </div>
              <div style={{ padding: '24px' }}>
                <h2 style={{ marginTop: 0, fontWeight: 'bold' }}>Логирование</h2>
                <p style={{ color: theme === 'dark' ? '#bbb' : '#666', fontSize: '16px' }}>
                  Детальное отслеживание активности пользователей и действий в системе.
                </p>
              </div>
            </div>
          </Col>
        </Row>

        <div style={{ marginTop: 48 }}>
          <Button
            type="primary"
            size="large"
            style={{
              marginRight: 16,
              height: '48px',
              fontSize: '16px',
              padding: '0 24px'
            }}
          >
            <Link to="/login">Войти</Link>
          </Button>
          <Button
            size="large"
            style={{
              height: '48px',
              fontSize: '16px',
              padding: '0 24px'
            }}
          >
            <Link to="/register">Регистрация</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Аутентифицированный интерфейс (для обычного пользователя и администратора)
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '30px auto',
      padding: '20px',
      background: theme === 'dark' ? '#1f1f1f' : 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      {isAdmin ? (
        // Интерфейс администратора
        <div>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
            Панель администратора
          </Title>

          <Tabs defaultActiveKey="1" style={{ marginBottom: '20px' }}>
            <TabPane tab={
              <span>
                <UserOutlined /> Основное
              </span>
            } key="1">
              <div style={{
                textAlign: 'center',
                padding: '30px',
                background: theme === 'dark' ? '#141414' : '#f9f9f9',
                borderRadius: '8px'
              }}>
                <div style={{ marginBottom: '30px' }}>
                  <Badge
                    count={count}
                    showZero
                    style={{
                      backgroundColor: '#1890ff',
                      fontSize: '16px',
                      padding: '0 12px',
                      height: '28px',
                      lineHeight: '28px'
                    }}
                  >
                    <div style={{
                      width: '100px',
                      height: '100px',
                      lineHeight: '100px',
                      fontSize: '20px',
                      background: theme === 'dark' ? '#2d2d2d' : '#f0f0f0',
                      borderRadius: '50%',
                      margin: '0 auto'
                    }}>
                      Счетчик
                    </div>
                  </Badge>
                </div>

                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleIncrement}
                  size="large"
                  style={{ padding: '0 24px', height: '45px' }}
                >
                  Увеличить счетчик
                </Button>

                <Paragraph style={{ marginTop: '20px', fontSize: '16px' }}>
                  Текущая тема: <strong>{theme === 'dark' ? 'Темная' : 'Светлая'}</strong>
                </Paragraph>
              </div>
            </TabPane>

            <TabPane tab={
              <span>
                <LineChartOutlined /> Логирование
              </span>
            } key="2">
              <LoggingControl />
            </TabPane>
          </Tabs>
        </div>
      ) : (
        // Интерфейс обычного пользователя
        <div>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
            Личный кабинет пользователя
          </Title>

          <div style={{
            textAlign: 'center',
            padding: '50px',
            background: theme === 'dark' ? '#141414' : '#f9f9f9',
            borderRadius: '8px'
          }}>
            <div style={{ marginBottom: '40px' }}>
              <Badge
                count={count}
                showZero
                style={{
                  backgroundColor: '#1890ff',
                  fontSize: '16px',
                  padding: '0 12px',
                  height: '28px',
                  lineHeight: '28px'
                }}
              >
                <div style={{
                  width: '120px',
                  height: '120px',
                  lineHeight: '120px',
                  fontSize: '22px',
                  background: theme === 'dark' ? '#2d2d2d' : '#f0f0f0',
                  borderRadius: '50%',
                  margin: '0 auto'
                }}>
                  Счетчик
                </div>
              </Badge>
            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleIncrement}
              size="large"
              style={{ padding: '0 30px', height: '48px', fontSize: '16px' }}
            >
              Увеличить счетчик
            </Button>

            <Paragraph style={{ marginTop: '20px', fontSize: '16px' }}>
              Текущая тема: <strong>{theme === 'dark' ? 'Темная' : 'Светлая'}</strong>
            </Paragraph>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;