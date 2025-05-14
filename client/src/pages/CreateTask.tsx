import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { taskService } from '../services/taskService';
import { TaskCreateData } from '../types/task';
import { useToast } from '../hooks/use-toast';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Star,
  Flame,
  Target,
  Tags,
  FileText,
  User,
  XCircle,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Repeat
} from 'lucide-react';

const CreateTask: React.FC = () => {
  // States
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskCreateData>({
    defaultValues: {
      taskType: 'ежедневная',
      priority: 'средний',
      difficulty: 'средняя',
      repeatDays: [], // Initialize as empty arrays
      skills: []      // Initialize as empty arrays
    }
  });

  // Mouse follower effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Watch task type for conditional rendering
  const taskType = watch('taskType');

  // Ensure these are arrays
  const watchedRepeatDays = watch('repeatDays') || [];
  const watchedSkills = watch('skills') || [];

  // Form submission
  const onSubmit = async (data: TaskCreateData) => {
    setIsLoading(true);
    setError('');

    try {
      // Add default reminderTime if not provided
      if (!data.reminderTime) {
        data.reminderTime = '09:00'; // Default reminder time
      }
      
      // Convert tags if needed
      if (typeof data.tags === 'string') {
        data.tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
      
      const result = await taskService.createTask(data);
      
      setSuccess('Задача успешно создана! Переход к списку задач...');
      setShowSuccessAnimation(true);
      
      setTimeout(() => {
        navigate('/tasks');
      }, 2000);
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
      setError('Не удалось создать задачу. Пожалуйста, проверьте введенные данные.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add animation styles
  useEffect(() => {
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

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

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

      {/* Mouse follower light effect */}
      <div
        className="pointer-events-none fixed w-64 h-64 rounded-full bg-gradient-to-r from-indigo-500/5 to-transparent blur-2xl"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
          transition: 'transform 0.2s ease-out'
        }}
      />

      {/* Success portal animation */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-400 rounded-full animate-ping opacity-20" />
            <div className="w-64 h-64 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-400 flex items-center justify-center animate-pulse">
              <Sparkles className="h-32 w-32 text-white animate-bounce" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-xl font-bold animate-pulse">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl relative z-10">
        <div className="animate-fade-in-up">
          {/* Header with back button */}
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700/80 transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Новая задача
            </h1>
          </div>

          {/* Main card */}
          <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-800/60 rounded-xl shadow-xl overflow-hidden">
            <div className="relative z-10 p-6">
              {/* Header */}
              <div className="text-center space-y-2 mb-6">
                <div className="flex items-center justify-center">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    Создание квеста
                  </h2>
                </div>
                <p className="text-gray-300 text-sm">
                  Опиши задачу, определи сложность и получи опыт за выполнение
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 mb-4 bg-red-500/10 rounded-lg border border-red-500/20 flex items-center gap-3 animate-shake">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Title field */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-cyan-300 flex items-center gap-1">
                    <Target size={12} /> Название задачи
                  </label>
                  <div className="relative">
                    <input
                      {...register('title', {
                        required: 'Название задачи обязательно',
                        maxLength: {
                          value: 100,
                          message: 'Название не может быть длиннее 100 символов'
                        }
                      })}
                      placeholder="Например: Прочитать книгу"
                      className={`w-full bg-gray-800/60 border ${
                        errors.title ? 'border-red-500/50' : 'border-indigo-500/20 focus:border-indigo-500/60'
                      } rounded-lg p-2 pl-8 text-gray-100 outline-none transition-all duration-300 text-sm`}
                    />
                    <Target className="absolute left-2.5 top-2.5 text-indigo-400" size={16} />
                    {watch('title') && (
                      <div className="absolute right-2.5 top-2.5">
                        {errors.title ? (
                          <XCircle size={16} className="text-red-400" />
                        ) : (
                          <CheckCircle2 size={16} className="text-green-400" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.title && (
                    <p className="text-red-400 text-xs">{errors.title.message as string}</p>
                  )}
                </div>

                {/* Description field */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-cyan-300 flex items-center gap-1">
                    <FileText size={12} /> Описание
                  </label>
                  <div className="relative">
                    <textarea
                      {...register('description', {
                        maxLength: {
                          value: 500,
                          message: 'Описание не может быть длиннее 500 символов'
                        }
                      })}
                      placeholder="Детали задачи..."
                      className={`w-full bg-gray-800/60 border ${
                        errors.description ? 'border-red-500/50' : 'border-indigo-500/20 focus:border-indigo-500/60'
                      } rounded-lg p-2 pl-8 text-gray-100 outline-none transition-all duration-300 text-sm min-h-20`}
                    />
                    <FileText className="absolute left-2.5 top-2.5 text-indigo-400" size={16} />
                  </div>
                  {errors.description && (
                    <p className="text-red-400 text-xs">{errors.description.message as string}</p>
                  )}
                </div>

                {/* Two column layout for compact fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Task Type */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-cyan-300 flex items-center gap-1">
                      <Repeat size={12} /> Тип задачи
                    </label>
                    <div className="relative">
                      <select
                        {...register('taskType', { required: true })}
                        className="w-full bg-gray-800/60 border border-indigo-500/20 focus:border-indigo-500/60 rounded-lg p-2 pl-8 text-gray-100 outline-none transition-all duration-300 text-sm appearance-none"
                      >
                        <option value="ежедневная">Ежедневная задача</option>
                        <option value="долгосрочная">Долгосрочная задача</option>
                        <option value="привычка">Привычка</option>
                        <option value="босс">Босс (сложная задача)</option>
                      </select>
                      <Repeat className="absolute left-2.5 top-2.5 text-indigo-400" size={16} />
                      <div className="absolute right-2.5 top-2.5 pointer-events-none">
                        <ArrowRight size={14} className="text-indigo-400" />
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-cyan-300 flex items-center gap-1">
                      <Tags size={12} /> Категория
                    </label>
                    <div className="relative">
                      <select
                        {...register('category', { required: true })}
                        className="w-full bg-gray-800/60 border border-indigo-500/20 focus:border-indigo-500/60 rounded-lg p-2 pl-8 text-gray-100 outline-none transition-all duration-300 text-sm appearance-none"
                      >
                        <option value="личное развитие">Личное развитие</option> → <option value="личноеРазвитие">Личное развитие</option>
                        <option value="работа">Работа</option>
                        <option value="отношения">Отношения</option>
                        <option value="здоровье">Здоровье</option>
                        <option value="творчество">Творчество</option>
                      </select>
                      <Tags className="absolute left-2.5 top-2.5 text-indigo-400" size={16} />
                      <div className="absolute right-2.5 top-2.5 pointer-events-none">
                        <ArrowRight size={14} className="text-indigo-400" />
                      </div>
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-cyan-300 flex items-center gap-1">
                      <Star size={12} /> Приоритет
                    </label>
                    <div className="relative">
                      <select
                        {...register('priority')}
                        className="w-full bg-gray-800/60 border border-indigo-500/20 focus:border-indigo-500/60 rounded-lg p-2 pl-8 text-gray-100 outline-none transition-all duration-300 text-sm appearance-none"
                      >
                        <option value="низкий">Низкий</option>
                        <option value="средний">Средний</option>
                        <option value="высокий">Высокий</option>
                        <option value="критический">Критический</option>
                      </select>
                      <Star className="absolute left-2.5 top-2.5 text-indigo-400" size={16} />
                      <div className="absolute right-2.5 top-2.5 pointer-events-none">
                        <ArrowRight size={14} className="text-indigo-400" />
                      </div>
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-cyan-300 flex items-center gap-1">
                      <BarChart3 size={12} /> Сложность
                    </label>
                    <div className="relative">
                      <select
                        {...register('difficulty')}
                        className="w-full bg-gray-800/60 border border-indigo-500/20 focus:border-indigo-500/60 rounded-lg p-2 pl-8 text-gray-100 outline-none transition-all duration-300 text-sm appearance-none"
                      >
                        <option value="очень легкая">Очень легкая</option>
                        <option value="легкая">Легкая</option>
                        <option value="средняя">Средняя</option>
                        <option value="сложная">Сложная</option>
                        <option value="очень сложная">Очень сложная</option>
                      </select>
                      <BarChart3 className="absolute left-2.5 top-2.5 text-indigo-400" size={16} />
                      <div className="absolute right-2.5 top-2.5 pointer-events-none">
                        <ArrowRight size={14} className="text-indigo-400" />
                      </div>
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-cyan-300 flex items-center gap-1">
                      <Calendar size={12} /> Срок выполнения
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        {...register('dueDate')}
                        className="w-full bg-gray-800/60 border border-indigo-500/20 focus:border-indigo-500/60 rounded-lg p-2 pl-8 text-gray-100 outline-none transition-all duration-300 text-sm"
                      />
                      <Calendar className="absolute left-2.5 top-2.5 text-indigo-400" size={16} />
                    </div>
                  </div>
                </div>

                {/* Repeat days (conditional) */}
                {(taskType === 'привычка' || taskType === 'ежедневная') && (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-cyan-300 flex items-center gap-1">
                      <Repeat size={12} /> Дни повторения
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map((day) => (
                        <label
                          key={day}
                          className={`flex items-center justify-center h-8 w-8 rounded-full cursor-pointer transition-all ${
                            watchedRepeatDays.includes(day)
                              ? 'bg-indigo-600 text-white border-indigo-500'
                              : 'bg-gray-800/60 text-gray-400 border-gray-700/50 hover:bg-gray-700/80'
                          } border text-xs`}
                        >
                          <input
                            type="checkbox"
                            value={day}
                            {...register('repeatDays')}
                            className="hidden"
                          />
                          {day}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills - styled as toggleable badges */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-cyan-300 flex items-center gap-1">
                    <User size={12} /> Навыки
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'концентрация', 'творчество', 'дисциплина', 'общение',
                      'физическая активность', 'ментальное здоровье', 'продуктивность',
                      'эмоциональный интеллект', 'знания', 'стрессоустойчивость'
                    ].map((skill) => (
                      <label
                        key={skill}
                        className={`flex items-center px-3 py-1 rounded-full cursor-pointer text-xs transition-all ${
                          watchedSkills.includes(skill)
                            ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-indigo-500'
                            : 'bg-gray-800/60 text-gray-400 border-gray-700/50 hover:bg-gray-700/80'
                        } border`}
                      >
                        <input
                          type="checkbox"
                          value={skill}
                          {...register('skills')}
                          className="hidden"
                        />
                        {skill}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-cyan-300 flex items-center gap-1">
                    <Tags size={12} /> Теги (через запятую)
                  </label>
                  <div className="relative">
                    <input
                      {...register('tags')}
                      placeholder="работа, срочно, проект"
                      className="w-full bg-gray-800/60 border border-indigo-500/20 focus:border-indigo-500/60 rounded-lg p-2 pl-8 text-gray-100 outline-none transition-all duration-300 text-sm"
                    />
                    <Tags className="absolute left-2.5 top-2.5 text-indigo-400" size={16} />
                  </div>
                  <p className="text-xs text-gray-500">
                    Теги помогут группировать и находить похожие задачи
                  </p>
                </div>

                {/* Submit button with animation */}
                <div className="relative group pt-2">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300" />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full h-10 text-sm bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg shadow-md shadow-indigo-500/20 flex items-center justify-center text-white font-medium overflow-hidden"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Создание задачи...
                      </>
                    ) : (
                      <>
                        <Flame className="h-4 w-4 mr-1" />
                        Создать квест
                        <ArrowRight className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Cancel button below form */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs text-cyan-300 hover:text-cyan-200 transition-colors group flex items-center justify-center mx-auto"
            >
              <ArrowLeft className="mr-1 h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
              <span className="group-hover:underline">Вернуться к списку задач</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;