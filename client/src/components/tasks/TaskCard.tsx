import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card.tsx';
import { Button } from '../ui/Button.tsx';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Award, 
  BarChart2, 
  XCircle, 
  Star 
} from 'lucide-react';
import { Task } from '../../types/task';
import { cn } from '../../lib/utils';
import { formatDate } from '../../lib/formatters';
import { useToast } from '../../hooks/use-toast';
import { taskService } from '../../services/taskService';

interface TaskCardProps {
  task: Task;
  onTaskUpdate?: () => void;
  showActions?: boolean;
}

export const TaskCard = ({ task, onTaskUpdate, showActions = true }: TaskCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Определение цвета категории
  const getCategoryColor = (category: string) => {
    const normalizedCategory = category.replace(/\s+/g, '-');
    return `bg-category-${normalizedCategory}`;
  };

  // Определение иконки статуса
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'выполнена':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'в процессе':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'запланирована':
        return <Calendar className="h-5 w-5 text-gray-500" />;
      case 'отложена':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'провалена':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Определение иконки типа задачи
  const getTaskTypeIcon = (taskType: string) => {
    switch (taskType) {
      case 'ежедневная':
        return <Calendar className="h-4 w-4" />;
      case 'привычка':
        return <BarChart2 className="h-4 w-4" />;
      case 'долгосрочная':
        return <Clock className="h-4 w-4" />;
      case 'босс':
        return <Star className="h-4 w-4 text-amber-500" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  // Определение иконки приоритета
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'низкий':
        return <div className="w-2 h-2 rounded-full bg-blue-400"></div>;
      case 'средний':
        return <div className="w-2 h-2 rounded-full bg-green-400"></div>;
      case 'высокий':
        return <div className="w-2 h-2 rounded-full bg-amber-400"></div>;
      case 'критический':
        return <div className="w-2 h-2 rounded-full bg-red-500"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-400"></div>;
    }
  };

  // Текст награды
  const getRewardText = () => {
    const { experience, energy } = task.reward;
    let text = `${experience} опыта`;
    if (energy > 0) text += `, +${energy} энергии`;
    else if (energy < 0) text += `, ${energy} энергии`;
    return text;
  };

  // Обработчик выполнения задачи
  const handleCompleteTask = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await taskService.completeTask(task._id);
      toast({
        title: "Задача выполнена!",
        description: "Вы получили награду за выполнение задачи.",
        variant: "success",
      });
      if (onTaskUpdate) onTaskUpdate();
    } catch (error) {
      toast({
        title: "Ошибка!",
        description: "Не удалось выполнить задачу.",
        variant: "destructive",
      });
    }
  };

  // Обработчик провала задачи
  const handleFailTask = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await taskService.failTask(task._id);
      toast({
        title: "Задача отмечена как невыполненная",
        description: "Вы можете попробовать снова позже.",
      });
      if (onTaskUpdate) onTaskUpdate();
    } catch (error) {
      toast({
        title: "Ошибка!",
        description: "Не удалось обновить статус задачи.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card
      className={cn(
        "border hover:border-primary transition-colors cursor-pointer",
        task.status === 'выполнена' && "opacity-75"
      )}
      onClick={() => navigate(`/tasks/${task._id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          {/* Категория */}
          <div className={cn(
            "text-xs font-medium py-1 px-2 rounded-full text-white",
            getCategoryColor(task.category)
          )}>
            {task.category}
          </div>

          {/* Статус */}
          <div className="flex items-center">
            {getStatusIcon(task.status)}
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{task.title}</h3>

        {task.description && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          {/* Тип задачи */}
          <div className="flex items-center text-xs text-muted-foreground">
            {getTaskTypeIcon(task.taskType)}
            <span className="ml-1 capitalize">{task.taskType}</span>
          </div>

          {/* Приоритет */}
          <div className="flex items-center text-xs text-muted-foreground">
            {getPriorityIcon(task.priority)}
            <span className="ml-1 capitalize">{task.priority}</span>
          </div>
        </div>

        {/* Сроки выполнения */}
        {task.dueDate && (
          <div className="flex items-center text-xs text-muted-foreground mb-3">
            <Clock className="h-4 w-4 mr-1" />
            <span>До {formatDate(task.dueDate)}</span>
          </div>
        )}

        {/* Награда */}
        <div className="flex items-center text-xs font-medium mb-3">
          <Award className="h-4 w-4 text-purple-500 mr-1" />
          <span>{getRewardText()}</span>
        </div>

        {/* Кнопки действий */}
        {showActions && task.status !== 'выполнена' && task.status !== 'провалена' && (
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm" 
              className="flex-1" 
              onClick={handleCompleteTask}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Выполнить
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1" 
              onClick={handleFailTask}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Не удалось
            </Button>
          </div>
        )}

        {/* Прогресс для долгосрочных задач */}
        {(task.taskType === 'долгосрочная' || task.taskType === 'босс') && task.progress > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Прогресс</span>
              <span>{task.progress}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary"
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 