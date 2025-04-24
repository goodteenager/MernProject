import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card.tsx';
import { Button } from '../components/ui/Button.tsx';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../hooks/use-toast';
import { Moon, Sun, Monitor, Bell } from 'lucide-react';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Обработчик смены темы
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);

    if (user) {
      // Также обновляем настройки пользователя
      const mappedTheme = newTheme === 'light' ? 'светлая' : newTheme === 'dark' ? 'тёмная' : 'системная';
      updateSettings({ theme: mappedTheme });
    }
  };

  // Обработчик изменения настроек уведомлений
  const toggleNotification = (type: 'email' | 'push' | 'dailyReminder') => {
    if (!user) return;

    const currentSettings = { ...user.settings };
    currentSettings.notifications[type] = !currentSettings.notifications[type];
    
    updateSettings({ notifications: currentSettings.notifications });
  };

  // Обработчик изменения времени напоминания
  const handleReminderTimeChange = (time: string) => {
    if (!user) return;

    const currentSettings = { ...user.settings };
    currentSettings.notifications.reminderTime = time;
    
    updateSettings({ notifications: currentSettings.notifications });
  };

  // Обновление настроек на сервере
  const updateSettings = async (settingsData: any) => {
    setIsLoading(true);
    try {
      const updatedSettings = await authService.updateSettings(settingsData);
      updateUser({ settings: updatedSettings });
      toast({
        title: 'Настройки обновлены',
        description: 'Ваши настройки успешно сохранены',
        variant: 'success',
      });
    } catch (error) {
      console.error('Ошибка при обновлении настроек:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить настройки',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Настройки</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Настройки темы */}
        <Card>
          <CardHeader>
            <CardTitle>Внешний вид</CardTitle>
            <CardDescription>
              Настройте внешний вид приложения
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-24 space-y-2"
                onClick={() => handleThemeChange('light')}
              >
                <Sun className="h-8 w-8" />
                <span>Светлая</span>
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-24 space-y-2"
                onClick={() => handleThemeChange('dark')}
              >
                <Moon className="h-8 w-8" />
                <span>Тёмная</span>
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-24 space-y-2"
                onClick={() => handleThemeChange('system')}
              >
                <Monitor className="h-8 w-8" />
                <span>Системная</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Настройки уведомлений */}
        <Card>
          <CardHeader>
            <CardTitle>Уведомления</CardTitle>
            <CardDescription>
              Настройте параметры уведомлений
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email уведомления</h3>
                <p className="text-sm text-muted-foreground">
                  Получать уведомления по email
                </p>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={user.settings.notifications.email}
                  onChange={() => toggleNotification('email')}
                  className="toggle"
                  id="email-notifications"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push-уведомления</h3>
                <p className="text-sm text-muted-foreground">
                  Получать push-уведомления в браузере
                </p>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={user.settings.notifications.push}
                  onChange={() => toggleNotification('push')}
                  className="toggle"
                  id="push-notifications"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Ежедневные напоминания</h3>
                <p className="text-sm text-muted-foreground">
                  Получать ежедневные напоминания о задачах
                </p>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={user.settings.notifications.dailyReminder}
                  onChange={() => toggleNotification('dailyReminder')}
                  className="toggle"
                  id="daily-reminder"
                />
              </div>
            </div>

            {user.settings.notifications.dailyReminder && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Время напоминания</label>
                <input
                  type="time"
                  value={user.settings.notifications.reminderTime}
                  onChange={(e) => handleReminderTimeChange(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Языковые настройки */}
        <Card>
          <CardHeader>
            <CardTitle>Язык</CardTitle>
            <CardDescription>
              Выберите язык интерфейса
            </CardDescription>
          </CardHeader>
          <CardContent>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={user.settings.language}
              onChange={(e) => updateSettings({ language: e.target.value })}
            >
              <option value="русский">Русский</option>
              <option value="английский">English</option>
            </select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings; 