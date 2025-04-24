import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import { reportService } from '../services/reportService';
import { taskService } from '../services/taskService';
import { ReportCreateData } from '../types/report';
import { Task } from '../types/task';
import { useToast } from '../hooks/use-toast';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const CreateReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [strengths, setStrengths] = useState<{ title: string; details?: string }[]>([]);
  const [newStrength, setNewStrength] = useState('');
  const [weaknesses, setWeaknesses] = useState<{ title: string; details?: string; workingOn: boolean }[]>([]);
  const [newWeakness, setNewWeakness] = useState('');
  const [goals, setGoals] = useState<{ title: string; category?: string }[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportCreateData>({
    defaultValues: {
      reportType: 'ежедневный',
      rating: 5,
      mood: 'нейтрально',
      energyLevel: 50
    }
  });

  // Загрузка задач на сегодня для помощи при составлении отчета
  useState(() => {
    const fetchTodayTasks = async () => {
      try {
        const tasks = await taskService.getTodayTasks();
        setTodayTasks(tasks);
      } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
      }
    };

    fetchTodayTasks();
  });

  // Добавление сильной стороны
  const addStrength = () => {
    if (!newStrength.trim()) return;
    setStrengths([...strengths, { title: newStrength.trim() }]);
    setNewStrength('');
  };

  // Удаление сильной стороны
  const removeStrength = (index: number) => {
    setStrengths(strengths.filter((_, i) => i !== index));
  };

  // Добавление слабой стороны
  const addWeakness = () => {
    if (!newWeakness.trim()) return;
    setWeaknesses([...weaknesses, { title: newWeakness.trim(), workingOn: false }]);
    setNewWeakness('');
  };

  // Удаление слабой стороны
  const removeWeakness = (index: number) => {
    setWeaknesses(weaknesses.filter((_, i) => i !== index));
  };

  // Переключение статуса "работаю над этим" для слабой стороны
  const toggleWorkingOn = (index: number) => {
    const updatedWeaknesses = [...weaknesses];
    updatedWeaknesses[index].workingOn = !updatedWeaknesses[index].workingOn;
    setWeaknesses(updatedWeaknesses);
  };

  // Добавление цели
  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([...goals, { title: newGoal.trim() }]);
    setNewGoal('');
  };

  // Удаление цели
  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  // Отправка формы
  const onSubmit = async (data: ReportCreateData) => {
    setIsLoading(true);
    try {
      // Добавляем собранные данные
      data.strengths = strengths;
      data.weaknesses = weaknesses;
      data.nextPeriodGoals = goals;

      await reportService.createReport(data);
      toast({
        title: 'Отчет создан',
        description: 'Ваш отчет успешно сохранен',
        variant: 'success',
      });
      navigate('/reports');
    } catch (error) {
      console.error('Ошибка при создании отчета:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать отчет',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Новый отчет</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Основные данные отчета */}
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Тип отчета */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Тип отчета</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register('reportType')}
                >
                  <option value="ежедневный">Ежедневный</option>
                  <option value="еженедельный">Еженедельный</option>
                  <option value="ежемесячный">Ежемесячный</option>
                </select>
              </div>

              {/* Оценка периода */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Оценка дня (1-10)</label>
                <Input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  className="w-full"
                  {...register('rating', {
                    required: 'Это поле обязательно',
                    min: { value: 1, message: 'Минимальная оценка - 1' },
                    max: { value: 10, message: 'Максимальная оценка - 10' }
                  })}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
                {errors.rating && (
                  <p className="text-sm text-red-500">{errors.rating.message}</p>
                )}
              </div>

              {/* Настроение */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Настроение</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register('mood', { required: 'Это поле обязательно' })}
                >
                  <option value="отлично">Отлично</option>
                  <option value="хорошо">Хорошо</option>
                  <option value="нейтрально">Нейтрально</option>
                  <option value="плохо">Плохо</option>
                  <option value="ужасно">Ужасно</option>
                </select>
                {errors.mood && (
                  <p className="text-sm text-red-500">{errors.mood.message}</p>
                )}
              </div>

              {/* Уровень энергии */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Уровень энергии (0-100)</label>
                <Input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  className="w-full"
                  {...register('energyLevel', {
                    required: 'Это поле обязательно',
                    min: { value: 0, message: 'Минимальный уровень - 0' },
                    max: { value: 100, message: 'Максимальный уровень - 100' }
                  })}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
                {errors.energyLevel && (
                  <p className="text-sm text-red-500">{errors.energyLevel.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Рефлексия */}
          <Card>
            <CardHeader>
              <CardTitle>Рефлексия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Позитивные моменты */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Что было хорошего?</label>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Ваши достижения, радостные моменты..."
                  {...register('positive')}
                />
              </div>

              {/* Негативные моменты */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Что было плохого?</label>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Ваши трудности, негативные моменты..."
                  {...register('negative')}
                />
              </div>

              {/* Выводы */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Какие выводы вы сделали?</label>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Чему вы научились, что поняли..."
                  {...register('lessons')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Цели на следующий период */}
          <Card>
            <CardHeader>
              <CardTitle>Цели на следующий период</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Добавить цель</label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Новая цель..."
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                  />
                  <Button type="button" onClick={addGoal} disabled={!newGoal.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {goals.length > 0 ? (
                <div className="space-y-2">
                  {goals.map((goal, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <span>{goal.title}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeGoal(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-2">
                  Нет целей на следующий период
                </p>
              )}

              {/* Подсказка с задачами на сегодня */}
              {todayTasks.length > 0 && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-2">Ваши задачи на сегодня:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {todayTasks.map((task) => (
                      <li key={task._id}>• {task.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Сильные и слабые стороны */}
          <Card>
            <CardHeader>
              <CardTitle>Сильные и слабые стороны</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Сильные стороны */}
              <div className="space-y-4">
                <h3 className="font-medium">Сильные стороны</h3>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Новая сильная сторона..."
                      value={newStrength}
                      onChange={(e) => setNewStrength(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addStrength()}
                    />
                    <Button type="button" onClick={addStrength} disabled={!newStrength.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {strengths.length > 0 ? (
                    <div className="space-y-2">
                      {strengths.map((strength, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                          <span>{strength.title}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeStrength(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-2">
                      Нет добавленных сильных сторон
                    </p>
                  )}
                </div>
              </div>

              {/* Слабые стороны */}
              <div className="space-y-4">
                <h3 className="font-medium">Слабые стороны</h3>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Новая слабая сторона..."
                      value={newWeakness}
                      onChange={(e) => setNewWeakness(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addWeakness()}
                    />
                    <Button type="button" onClick={addWeakness} disabled={!newWeakness.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {weaknesses.length > 0 ? (
                    <div className="space-y-2">
                      {weaknesses.map((weakness, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center space-x-2">
                            <span>{weakness.title}</span>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`working-${index}`}
                                checked={weakness.workingOn}
                                onChange={() => toggleWorkingOn(index)}
                                className="mr-1"
                              />
                              <label htmlFor={`working-${index}`} className="text-xs">
                                Работаю над этим
                              </label>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeWeakness(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-2">
                      Нет добавленных слабых сторон
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-end space-x-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/reports')}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить отчет'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateReport;