import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { taskService } from '../services/taskService';
import { achievementService } from '../services/achievementService';
import { Task } from '../types/task';
import { Achievement } from '../types/achievement';
import {
  Plus,
  Calendar,
  CheckCircle2,
  Award,
  ArrowRight,
  BarChart2,
  Sparkles,
  Flame,
  AlertTriangle,
  User,
  XCircle
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [todayTasks, setTodayTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mentorTip, setMentorTip] = useState('');
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse follower effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get today's tasks
        const todayTasksData = await taskService.getTodayTasks();
        setTodayTasks(todayTasksData);

        // Get recently completed tasks
        const completedTasksData = await taskService.getTasks({
          status: 'выполнена',
          limit: 5,
          sort: '-reflection.completedAt'
        });
        setCompletedTasks(completedTasksData.data);

        // Get latest achievements
        const achievementsData = await achievementService.getUserAchievements();
        setAchievements(achievementsData.slice(0, 3));

        // Check for new achievements
        await achievementService.checkAchievements();
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Не удалось загрузить данные магического портала');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate mentor tips
  useEffect(() => {
    const tips = [
      'Начинайте день с планирования ключевых задач — это помогает сохранять фокус.',
      'Помните, что баланс и внутреннее состояние важнее количества задач.',
      'Размышление о проделанной работе помогает лучше понять себя и свой прогресс.',
      'Маленькие шаги каждый день приводят к большим изменениям со временем.',
      'Празднуйте свои победы, даже маленькие — они укрепляют вашу мотивацию.'
    ];

    // Choose a random tip
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setMentorTip(randomTip);
  }, []);

  // Task update handler
  const handleTaskUpdate = async () => {
    try {
      const todayTasksData = await taskService.getTodayTasks();
      setTodayTasks(todayTasksData);

      const completedTasksData = await taskService.getTasks({
        status: 'выполнена',
        limit: 5,
        sort: '-reflection.completedAt'
      });
      setCompletedTasks(completedTasksData.data);
    } catch (error) {
      console.error('Error updating tasks:', error);
      setError('Не удалось обновить задания');
    }
  };

  // Render task card
  const renderTaskCard = (task) => {
    return (
      <div
        key={task._id}
        className="bg-gray-800/60 border border-indigo-500/20 hover:border-indigo-500/60 rounded-lg p-4 transition-all duration-300"
        onClick={() => navigate(`/tasks/${task._id}`)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center mr-3">
              {task.type === 'daily' ?
                <Flame className="h-4 w-4 text-indigo-400" /> :
                <Calendar className="h-4 w-4 text-indigo-400" />
              }
            </div>
            <div>
              <h3 className="font-medium text-gray-100">{task.title}</h3>
              <p className="text-xs text-gray-400">{task.description?.substring(0, 60)}...</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Add your complete task logic here
            }}
            className="bg-indigo-600/30 hover:bg-indigo-600/50 rounded-full p-1 transition-colors"
          >
            <CheckCircle2 className="h-5 w-5 text-indigo-400" />
          </button>
        </div>
      </div>
    );
  };

  // Render achievement card
  const renderAchievementCard = (achievement) => {
    return (
      <div
        key={achievement._id}
        className="bg-gray-800/60 border border-indigo-500/20 hover:border-indigo-500/60 rounded-lg p-4 transition-all duration-300 flex items-center space-x-3"
        onClick={() => navigate(`/achievements?id=${achievement._id}`)}
      >
        <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <Award className="h-5 w-5 text-indigo-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-100">{achievement.title}</h4>
          <p className="text-xs text-gray-400 line-clamp-1">{achievement.description}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
        <div className="w-16 h-16 border-t-2 border-indigo-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Minimalist background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
        {/* Subtle particle effect */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-indigo-500/10 animate-pulse"
            style={{
              width: `${Math.random() * 8 + 3}px`,
              height: `${Math.random() * 8 + 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 3}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Mouse follower light effect - more subtle */}
      <div
        className="pointer-events-none fixed w-64 h-64 rounded-full bg-gradient-to-r from-indigo-500/5 to-transparent blur-2xl"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
          transition: 'transform 0.2s ease-out'
        }}
      />

      <div className="w-full max-w-5xl relative z-10 animate-fade-in-up">
        {/* Main card - fantasy styled */}
        <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-800/60 rounded-xl shadow-xl overflow-hidden p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Мир IYouWe
              </h1>
            </div>
            <button
              onClick={() => navigate('/tasks/create')}
              className="relative px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg text-white font-medium overflow-hidden flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Новый квест
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 flex items-center gap-3 animate-shake mb-6">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {/* Welcome message and mentor tip */}
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-100 mb-2">
              Приветствую, <span className="text-cyan-300">{user?.username || 'Герой'}</span>!
            </h2>
            <div className="bg-indigo-900/30 border border-indigo-500/20 rounded-lg p-4 flex items-start space-x-4">
              <div className="bg-indigo-500/20 rounded-full p-2 flex-shrink-0">
                <Sparkles className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="font-medium text-cyan-300">Совет наставника:</p>
                <p className="text-gray-300 text-sm">{mentorTip}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Character stats column */}
            <div className="space-y-6">
              <div className="bg-gray-800/80 border border-gray-700/50 rounded-lg p-5">
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-cyan-300 mr-2" />
                  <h3 className="text-lg font-medium text-cyan-300">Герой</h3>
                </div>

                <div className="relative mb-4">
                  <div className="w-24 h-24 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-indigo-400" />
                  </div>
                  <div className="absolute bottom-0 right-1/2 transform translate-x-8 translate-y-2">
                    <div className="bg-indigo-600 rounded-full p-1">
                      <span className="text-xs font-bold text-white">{user?.statistics?.level || 1}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <h4 className="text-lg font-medium text-gray-100">{user?.username || 'Герой'}</h4>
                  <p className="text-xs text-gray-400">Искатель приключений</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Опыт</span>
                      <span className="text-cyan-300">{user?.statistics?.experience || 0}/100</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                        style={{ width: `${user?.statistics?.experience || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Энергия</span>
                      <span className="text-cyan-300">80/100</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: '80%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats boxes */}
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-800/60 border border-indigo-500/20 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Квесты дня</p>
                    <p className="text-xl font-bold text-gray-100">{todayTasks.length}</p>
                  </div>
                  <Calendar className="h-6 w-6 text-indigo-400" />
                </div>

                <div className="bg-gray-800/60 border border-green-500/20 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Завершено</p>
                    <p className="text-xl font-bold text-gray-100">{user?.statistics?.tasksCompleted || 0}</p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>

                <div className="bg-gray-800/60 border border-purple-500/20 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Цепочка дней</p>
                    <p className="text-xl font-bold text-gray-100">{user?.statistics?.streakDays || 0}</p>
                  </div>
                  <Flame className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Main content - 2 columns */}
            <div className="md:col-span-2 space-y-6">
              {/* Today's quests */}
              <div className="bg-gray-800/80 border border-gray-700/50 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-cyan-300 mr-2" />
                    <h3 className="text-lg font-medium text-cyan-300">Квесты дня</h3>
                  </div>
                  <button
                    onClick={() => navigate('/tasks')}
                    className="flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Все квесты
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>

                <div className="space-y-3">
                  {todayTasks.length > 0 ? (
                    <>
                      {todayTasks.slice(0, 3).map(task => renderTaskCard(task))}
                      {todayTasks.length > 3 && (
                        <button
                          className="w-full py-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                          onClick={() => navigate('/tasks')}
                        >
                          Показать все ({todayTasks.length})
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Нет заданий на сегодня</p>
                      <button
                        className="mt-4 px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 rounded-lg text-indigo-300 flex items-center justify-center mx-auto"
                        onClick={() => navigate('/tasks/create')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Создать новый квест
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-gray-800/80 border border-gray-700/50 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-cyan-300 mr-2" />
                    <h3 className="text-lg font-medium text-cyan-300">Достижения</h3>
                  </div>
                  <button
                    onClick={() => navigate('/achievements')}
                    className="flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Все достижения
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>

                <div className="space-y-3">
                  {achievements.length > 0 ? (
                    achievements.map(achievement => renderAchievementCard(achievement))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Пока нет достижений</p>
                      <button
                        className="mt-4 px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 rounded-lg text-indigo-300 flex items-center justify-center mx-auto"
                        onClick={() => navigate('/achievements')}
                      >
                        <Award className="h-4 w-4 mr-2" />
                        Исследовать достижения
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes slow-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes reverse-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
  20%, 40%, 60%, 80% { transform: translateX(3px); }
}

.animate-slow-spin {
  animation: slow-spin 40s linear infinite;
}

.animate-reverse-spin {
  animation: reverse-spin 50s linear infinite;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
`;
document.head.appendChild(styleSheet);

export default Dashboard;