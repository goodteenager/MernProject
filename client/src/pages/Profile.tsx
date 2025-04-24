import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar.tsx';
import { CharacterCard } from '../components/character/CharacterCard';
import { Progress } from '../components/ui/Progress.tsx';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { User } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface ProfileFormValues {
  username: string;
  email: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Форма для основных данных профиля
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
  });

  // Форма для смены пароля
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormValues>();

  const newPassword = watchPassword('newPassword');

  // Обработчик обновления профиля
  const onUpdateProfile = async (data: ProfileFormValues) => {
    setIsUpdating(true);
    try {
      const updatedUser = await authService.updateProfile(data);
      updateUser(updatedUser);
      toast({
        title: 'Профиль обновлен',
        description: 'Ваши данные успешно обновлены',
        variant: 'success',
      });
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить профиль',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Обработчик смены пароля
  const onChangePassword = async (data: PasswordFormValues) => {
    setIsChangingPassword(true);
    try {
      await authService.updatePassword(data.currentPassword, data.newPassword);
      toast({
        title: 'Пароль изменен',
        description: 'Ваш пароль успешно обновлен',
        variant: 'success',
      });
      resetPassword();
    } catch (error) {
      console.error('Ошибка при смене пароля:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить пароль. Проверьте текущий пароль',
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
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
      <h1 className="text-3xl font-bold">Профиль</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Информация о персонаже */}
        <div className="space-y-6">
          <CharacterCard />

          <Card>
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Выполнено задач</span>
                  <span>{user.statistics.tasksCompleted}</span>
                </div>
                <Progress value={Math.min(user.statistics.tasksCompleted, 100)} />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Текущий стрик</span>
                  <span>{user.statistics.streakDays} дней</span>
                </div>
                <Progress value={(user.statistics.streakDays / Math.max(user.statistics.maxStreakDays, 7)) * 100} />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Количество достижений</span>
                  <span>{user.achievements.length}</span>
                </div>
                <Progress value={Math.min(user.achievements.length * 10, 100)} />
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/analytics')}
              >
                Полная статистика
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Основная информация профиля */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
              <CardDescription>
                Обновите свои личные данные
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage 
                      src={`/avatars/${user.character.avatar}`} 
                      alt={user.username} 
                    />
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{user.username}</h3>
                    <p className="text-sm text-muted-foreground">
                      Дата регистрации: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Имя пользователя</label>
                  <Input 
                    {...registerProfile('username', { 
                      required: 'Имя пользователя обязательно',
                      minLength: {
                        value: 3,
                        message: 'Имя должно быть не менее 3 символов'
                      },
                      maxLength: {
                        value: 20,
                        message: 'Имя должно быть не более 20 символов'
                      }
                    })}
                  />
                  {profileErrors.username && (
                    <p className="text-sm text-red-500">{profileErrors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    type="email"
                    {...registerProfile('email', { 
                      required: 'Email обязателен',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Введите корректный email'
                      }
                    })}
                  />
                  {profileErrors.email && (
                    <p className="text-sm text-red-500">{profileErrors.email.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Обновление...' : 'Обновить профиль'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Изменение пароля</CardTitle>
              <CardDescription>
                Обновите свой пароль для безопасности
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Текущий пароль</label>
                  <Input 
                    type="password"
                    {...registerPassword('currentPassword', { 
                      required: 'Введите текущий пароль'
                    })}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Новый пароль</label>
                  <Input 
                    type="password"
                    {...registerPassword('newPassword', { 
                      required: 'Введите новый пароль',
                      minLength: {
                        value: 6,
                        message: 'Пароль должен быть не менее 6 символов'
                      }
                    })}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Подтверждение пароля</label>
                  <Input 
                    type="password"
                    {...registerPassword('confirmPassword', { 
                      required: 'Подтвердите пароль',
                      validate: value => 
                        value === newPassword || 'Пароли не совпадают'
                    })}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Обновление...' : 'Изменить пароль'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Персонаж</CardTitle>
              <CardDescription>
                Настройте внешний вид вашего персонажа
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate('/character')}
              >
                Настроить персонажа
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;