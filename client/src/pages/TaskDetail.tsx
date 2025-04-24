import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import { Progress } from '../components/ui/Progress.tsx';
import { taskService } from '../services/taskService';
import { Task, SubtaskData, TaskReflectionData } from '../types/task';
import { formatDate } from '../lib/formatters';
import { useToast } from '../hooks/use-toast';
import { 
  ArrowLeft, Edit, Trash2, CheckCircle2, Clock, XCircle, 
  AlertTriangle, Award, Plus, Calendar 
} from 'lucide-react';

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [newSubtask, setNewSubtask] = useState('');
  const [reflectionData, setReflectionData] = useState<TaskReflectionData>({});
  const [showReflection, setShowReflection] = useState(false);
  const [editingProgress, setEditingProgress] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (!id) return;
    
    const fetchTask = async () => {
      setLoading(true);
      try {
        const data = await taskService.getTask(id);
        setTask(data);
        setProgressValue(data.progress);
      } catch (error) {
        console.error('Ошибка при загрузке задачи:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить задачу',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, toast]);

  // Получение цвета категории
  const getCategoryColor = (category: string) => {
    const normalizedCategory = category?.replace(/\s+/g, '-');
    return `bg-category-${normalizedCategory}`;
  };

  // Обработчик выполнения задачи
  const handleCompleteTask = async () => {
    if (!task || !id) return;
    
    try {
      const result = await taskService.completeTask(id, reflectionData);
      toast({
        title: 'Задача выполнена!',
        description: `Вы получили ${result.rewards.experience} опыта`,
        variant: 'success',
      });
      // Обновляем задачу
      setTask({
        ...task,
        status: 'выполнена',
        reflection: {
          ...task.reflection,
          ...reflectionData,
          completedAt: new Date().toISOString()
        }
      });
      setShowReflection(false);
    } catch (error) {
      console.error('Ошибка при выполнении задачи:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить задачу',
        variant: 'destructive',
      });
    }
  };

  // Обработчик провала задачи
  const handleFailTask = async () => {
    if (!task || !id) return;
    
    try {
      await taskService.failTask(id, reflectionData);
      toast({
        title: 'Задача отмечена как невыполненная',
        description: 'Не расстраивайтесь, в следующий раз получится!',
      });
      // Обновляем задачу
      setTask({
        ...task,
        status: 'провалена',
        reflection: {
          ...task.reflection,
          ...reflectionData,
          completedAt: new Date().toISOString()
        }
      });
      setShowReflection(false);
    } catch (error) {
      console.error('Ошибка при отметке задачи как невыполненной:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус задачи',
        variant: 'destructive',
      });
    }
  };

  // Обработчик добавления подзадачи
  const handleAddSubtask = async () => {
    if (!task || !id || !newSubtask.trim()) return;
    
    try {
      const subtaskData: SubtaskData = {
        title: newSubtask
      };
      
      const updatedTask = await taskService.addSubtask(id, subtaskData);
      setTask(updatedTask);
      setNewSubtask('');
      
      toast({
        title: 'Подзадача добавлена',
        description: 'Новая подзадача успешно добавлена',
      });
    } catch (error) {
      console.error('Ошибка при добавлении подзадачи:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить подзадачу',
        variant: 'destructive',
      });
    }
  };

  // Обработчик переключения состояния подзадачи
  const handleToggleSubtask = async (subtaskId: string, completed: boolean) => {
    if (!task || !id) return;
    
    try {
      const updatedTask = await taskService.updateSubtask(id, subtaskId, { completed });
      setTask(updatedTask);
    } catch (error) {
      console.error('Ошибка при обновлении подзадачи:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить подзадачу',
        variant: 'destructive',
      });
    }
  };

  // Обработчик удаления подзадачи
  const handleDeleteSubtask = async (subtaskId: string) => {
    if (!task || !id) return;
    
    try {
      const updatedTask = await taskService.deleteSubtask(id, subtaskId);
      setTask(updatedTask);
      
      toast({
        title: 'Подзадача удалена',
        description: 'Подзадача успешно удалена',
      });
    } catch (error) {
      console.error('Ошибка при удалении подзадачи:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить подзадачу',
        variant: 'destructive',
      });
    }
  };

  // Обработчик обновления прогресса
  const handleUpdateProgress = async () => {
    if (!task || !id) return;
    
    try {
      const updatedTask = await taskService.updateTaskProgress(id, progressValue, reflectionData);
      setTask(updatedTask);
      setEditingProgress(false);
      
      if (progressValue === 100) {
        toast({
          title: 'Задача выполнена!',
          description: 'Поздравляем с завершением задачи',
          variant: 'success',
        });
      } else {
        toast({
          title: 'Прогресс обновлен',
          description: `Текущий прогресс: ${progressValue}%`,
        });
      }
    } catch (error) {
      console.error('Ошибка при обновлении прогресса:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить прогресс',
        variant: 'destructive',
      });
    }
  };

  // Обработчик удаления задачи
  const handleDeleteTask = async () => {
    if (!task || !id) return;
    
    if (!window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      return;
    }
    
    try {
      await taskService.deleteTask(id);
      toast({
        title: 'Задача удалена',
        description: 'Задача успешно удалена',
      });
      navigate('/tasks');
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить задачу',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Задача не найдена</h2>
        <p className="text-muted-foreground mb-4">Задача не существует или была удалена</p>
        <Button onClick={() => navigate('/tasks')}>
          Вернуться к списку задач
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Детали задачи</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Основная информация о задаче */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Информация</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigate(`/tasks/edit/${task._id}`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleDeleteTask}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Заголовок и категория */}
            <div>
              <div 
                className={`inline-block px-2 py-1 rounded-full text-xs text-white font-medium mb-2 ${getCategoryColor(task.category)}`}
              >
                {task.category}
              </div>
              <h2 className="text-2xl font-bold">{task.title}</h2>
            </div>

            {/* Статус задачи */}
            <div className="flex items-center space-x-2">
              {task.status === 'выполнена' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              {task.status === 'в процессе' && <Clock className="h-5 w-5 text-blue-500" />}
              {task.status === 'запланирована' && <Calendar className="h-5 w-5 text-gray-500" />}
              {task.status === 'отложена' && <Clock className="h-5 w-5 text-amber-500" />}
              {task.status === 'провалена' && <XCircle className="h-5 w-5 text-red-500" />}
              <span className="font-medium capitalize">{task.status}</span>
            </div>

            {/* Описание */}
            {task.description && (
              <div>
                <h3 className="font-medium mb-2">Описание</h3>
                <p className="text-muted-foreground whitespace-pre-line">{task.description}</p>
              </div>
            )}

            {/* Параметры задачи */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Тип задачи</h3>
                <p className="text-muted-foreground capitalize">{task.taskType}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Приоритет</h3>
                <p className="text-muted-foreground capitalize">{task.priority}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Сложность</h3>
                <p className="text-muted-foreground capitalize">{task.difficulty}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Дата создания</h3>
                <p className="text-muted-foreground">{formatDate(task.createdAt)}</p>
              </div>
              {task.dueDate && (
                <div>
                  <h3 className="font-medium mb-2">Срок выполнения</h3>
                  <p className="text-muted-foreground">{formatDate(task.dueDate)}</p>
                </div>
              )}
              {(task.taskType === 'ежедневная' || task.taskType === 'привычка') && task.repeatDays.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Дни повторения</h3>
                  <p className="text-muted-foreground">{task.repeatDays.join(', ')}</p>
                </div>
              )}
            </div>

            {/* Награда */}
            <div>
              <h3 className="font-medium mb-2">Награда</h3>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-500" />
                <span className="text-muted-foreground">
                  {task.reward.experience} опыта
                  {task.reward.energy > 0 && `, +${task.reward.energy} энергии`}
                  {task.reward.energy < 0 && `, ${task.reward.energy} энергии`}
                </span>
              </div>
            </div>

            {/* Навыки */}
            {task.skills && task.skills.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Развиваемые навыки</h3>
                <div className="flex flex-wrap gap-2">
                  {task.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-secondary px-2 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Теги */}
            {task.tags && task.tags.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Теги</h3>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-secondary px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Прогресс для долгосрочных задач и боссов */}
            {(task.taskType === 'долгосрочная' || task.taskType === 'босс') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Прогресс</h3>
                  {task.status !== 'выполнена' && task.status !== 'провалена' && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setEditingProgress(!editingProgress)}
                    >
                      {editingProgress ? 'Отмена' : 'Обновить'}
                    </Button>
                  )}
                </div>
                
                {editingProgress ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={progressValue}
                        onChange={(e) => setProgressValue(parseInt(e.target.value))}
                      />
                      <span className="min-w-[40px] text-right">{progressValue}%</span>
                    </div>
                    
                    <Button 
                      onClick={handleUpdateProgress}
                      disabled={progressValue === task.progress}
                    >
                      Сохранить прогресс
                    </Button>
                  </div>
                ) : (
                  <>
                    <Progress value={task.progress} />
                    <p className="text-right text-sm text-muted-foreground">{task.progress}%</p>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Правая колонка с подзадачами и действиями */}
        <div className="space-y-6">
          {/* Действия */}
          <Card>
            <CardHeader>
              <CardTitle>Действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {task.status !== 'выполнена' && task.status !== 'провалена' && (
                <>
                  <Button 
                    className="w-full" 
                    onClick={() => setShowReflection(true)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Выполнить задачу
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setShowReflection(true)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Не удалось выполнить
                  </Button>
                </>
              )}
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate(`/tasks/edit/${task._id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleDeleteTask}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </Button>
            </CardContent>
          </Card>

          {/* Подзадачи для долгосрочных задач и боссов */}
          {(task.taskType === 'долгосрочная' || task.taskType === 'босс') && (
            <Card>
              <CardHeader>
                <CardTitle>Подзадачи</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Список подзадач */}
                {task.subtasks.length > 0 ? (
                  <div className="space-y-2">
                    {task.subtasks.map((subtask) => (
                                            <div 
                                            key={subtask._id} 
                                            className="flex items-center justify-between p-2 border rounded-md"
                                          >
                                            <div className="flex items-center space-x-2">
                                              <input
                                                type="checkbox"
                                                checked={subtask.completed}
                                                onChange={() => handleToggleSubtask(subtask._id, !subtask.completed)}
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                                disabled={task.status === 'выполнена' || task.status === 'провалена'}
                                              />
                                              <span className={`${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                                                {subtask.title}
                                              </span>
                                            </div>
                                            
                                            <Button 
                                              variant="ghost" 
                                              size="icon"
                                              onClick={() => handleDeleteSubtask(subtask._id)}
                                              disabled={task.status === 'выполнена' || task.status === 'провалена'}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-center text-muted-foreground py-4">
                                        Нет подзадач
                                      </p>
                                    )}
                    
                                    {/* Добавление новой подзадачи */}
                                    {task.status !== 'выполнена' && task.status !== 'провалена' && (
                                      <div className="flex space-x-2">
                                        <Input
                                          placeholder="Новая подзадача..."
                                          value={newSubtask}
                                          onChange={(e) => setNewSubtask(e.target.value)}
                                          onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                                        />
                                        <Button onClick={handleAddSubtask} disabled={!newSubtask.trim()}>
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              )}
                    
                              {/* Рефлексия/история для выполненных задач */}
                              {(task.status === 'выполнена' || task.status === 'провалена') && task.reflection.completedAt && (
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Рефлексия</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div>
                                      <h3 className="font-medium mb-1">Дата {task.status === 'выполнена' ? 'выполнения' : 'провала'}:</h3>
                                      <p className="text-muted-foreground">
                                        {formatDate(task.reflection.completedAt)}
                                      </p>
                                    </div>
                                    
                                    {task.reflection.mood && (
                                      <div>
                                        <h3 className="font-medium mb-1">Настроение:</h3>
                                        <p className="text-muted-foreground capitalize">{task.reflection.mood}</p>
                                      </div>
                                    )}
                                    
                                    {task.reflection.perceivedDifficulty && (
                                      <div>
                                        <h3 className="font-medium mb-1">Ощущаемая сложность:</h3>
                                        <p className="text-muted-foreground">{task.reflection.perceivedDifficulty}</p>
                                      </div>
                                    )}
                                    
                                    {task.reflection.notes && (
                                      <div>
                                        <h3 className="font-medium mb-1">Заметки:</h3>
                                        <p className="text-muted-foreground whitespace-pre-line">{task.reflection.notes}</p>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                          </div>
                          
                          {/* Модальное окно для рефлексии */}
                          {showReflection && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                              <Card className="w-full max-w-md">
                                <CardHeader>
                                  <CardTitle>Рефлексия о задаче</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Как вы себя чувствуете?</label>
                                    <select
                                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                      value={reflectionData.mood || ''}
                                      onChange={(e) => setReflectionData({...reflectionData, mood: e.target.value})}
                                    >
                                      <option value="">Выберите настроение</option>
                                      <option value="отлично">Отлично</option>
                                      <option value="хорошо">Хорошо</option>
                                      <option value="нейтрально">Нейтрально</option>
                                      <option value="плохо">Плохо</option>
                                      <option value="ужасно">Ужасно</option>
                                    </select>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Насколько сложной была задача?</label>
                                    <select
                                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                      value={reflectionData.perceivedDifficulty || ''}
                                      onChange={(e) => setReflectionData({...reflectionData, perceivedDifficulty: e.target.value})}
                                    >
                                      <option value="">Выберите сложность</option>
                                      <option value="легче чем ожидалось">Легче чем ожидалось</option>
                                      <option value="как ожидалось">Как ожидалось</option>
                                      <option value="сложнее чем ожидалось">Сложнее чем ожидалось</option>
                                    </select>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Заметки (опционально)</label>
                                    <textarea
                                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                                      placeholder="Ваши мысли о выполнении задачи..."
                                      value={reflectionData.notes || ''}
                                      onChange={(e) => setReflectionData({...reflectionData, notes: e.target.value})}
                                    />
                                  </div>
                                  
                                  <div className="flex justify-end space-x-2 pt-4">
                                    <Button 
                                      variant="outline" 
                                      onClick={() => setShowReflection(false)}
                                    >
                                      Отмена
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      onClick={handleFailTask}
                                    >
                                      Не удалось
                                    </Button>
                                    <Button onClick={handleCompleteTask}>
                                      Выполнить
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </div>
                      );
                    };
                    
                    export default TaskDetail;