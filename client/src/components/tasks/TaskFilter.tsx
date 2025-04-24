import { useState } from 'react';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import { Calendar, Filter, Search, X } from 'lucide-react';

interface TaskFilterProps {
  onFilterChange: (filters: Record<string, any>) => void;
}

export const TaskFilter = ({ onFilterChange }: TaskFilterProps) => {
  // Состояние фильтров
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    taskType: '',
    dueDate: '',
    search: ''
  });

  // Состояние видимости фильтров
  const [showFilters, setShowFilters] = useState(false);

  // Обработчик изменения фильтров
  const handleFilterChange = (filterName: string, value: string) => {
    const updatedFilters = { ...filters, [filterName]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Сброс фильтров
  const resetFilters = () => {
    const emptyFilters = {
      status: '',
      category: '',
      priority: '',
      taskType: '',
      dueDate: '',
      search: ''
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Поиск и кнопка фильтра */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск задач..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          {filters.search && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => handleFilterChange('search', '')}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Фильтры
        </Button>
        {Object.values(filters).some(value => value !== '') && (
          <Button variant="ghost" onClick={resetFilters}>
            <X className="h-4 w-4 mr-1" />
            Сбросить
          </Button>
        )}
      </div>

      {/* Расширенные фильтры */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Статус */}
          <div>
            <label className="text-sm font-medium mb-1 block">Статус</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Все статусы</option>
              <option value="запланирована">Запланированы</option>
              <option value="в процессе">В процессе</option>
              <option value="выполнена">Выполнены</option>
              <option value="отложена">Отложены</option>
              <option value="провалена">Провалены</option>
            </select>
          </div>

          {/* Категория */}
          <div>
            <label className="text-sm font-medium mb-1 block">Категория</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">Все категории</option>
              <option value="личное развитие">Личное развитие</option>
              <option value="работа">Работа</option>
              <option value="отношения">Отношения</option>
              <option value="здоровье">Здоровье</option>
              <option value="творчество">Творчество</option>
            </select>
          </div>

          {/* Приоритет */}
          <div>
            <label className="text-sm font-medium mb-1 block">Приоритет</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">Любой приоритет</option>
              <option value="низкий">Низкий</option>
              <option value="средний">Средний</option>
              <option value="высокий">Высокий</option>
              <option value="критический">Критический</option>
            </select>
          </div>

          {/* Тип задачи */}
          <div>
            <label className="text-sm font-medium mb-1 block">Тип задачи</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={filters.taskType}
              onChange={(e) => handleFilterChange('taskType', e.target.value)}
            >
              <option value="">Все типы</option>
              <option value="ежедневная">Ежедневная</option>
              <option value="долгосрочная">Долгосрочная</option>
              <option value="привычка">Привычка</option>
              <option value="босс">Босс</option>
            </select>
          </div>

          {/* Срок выполнения */}
          <div>
            <label className="text-sm font-medium mb-1 block">Срок выполнения</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={filters.dueDate}
              onChange={(e) => handleFilterChange('dueDate', e.target.value)}
            >
              <option value="">Любая дата</option>
              <option value="today">Сегодня</option>
              <option value="week">На этой неделе</option>
              <option value="overdue">Просрочено</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}; 