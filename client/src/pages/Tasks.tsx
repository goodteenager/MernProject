import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { Task } from '../types/task';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFilter } from '../components/tasks/TaskFilter';
import { Button } from '../components/ui/Button.tsx';
import { Plus, RefreshCw } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Tasks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Загрузка задач
  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Преобразуем фильтры для API
      const apiFilters: Record<string, any> = { ...filters };
      
      // Обработка поискового запроса
      if (filters.search) {
        apiFilters.title = filters.search;
        delete apiFilters.search;
      }
      
      const response = await taskService.getTasks(apiFilters);
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке задач:', error);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить задачи',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Загрузка задач при монтировании и изменении фильтров
  useEffect(() => {
    fetchTasks();
  }, [filters]);

  // Обработчик изменения фильтров
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  // Обработчик обновления задачи
  const handleTaskUpdate = () => {
    fetchTasks();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Задачи</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchTasks}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Обновить
          </Button>
          <Button onClick={() => navigate('/tasks/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Новая задача
          </Button>
        </div>
      </div>

      {/* Фильтры задач */}
      <TaskFilter onFilterChange={handleFilterChange} />

      {/* Список задач */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onTaskUpdate={handleTaskUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <p className="text-muted-foreground text-lg">Нет задач, соответствующих фильтрам</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setFilters({});
              fetchTasks();
            }}
          >
            Сбросить фильтры
          </Button>
        </div>
      )}
    </div>
  );
};

export default Tasks; 