import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.tsx';
import { Button } from '../components/ui/Button.tsx';
import { reportService } from '../services/reportService';
import { Report } from '../types/report';
import { formatDate } from '../lib/formatters';
import { useToast } from '../hooks/use-toast';
import { Plus, FileText, CalendarDays, BarChart2, RefreshCw } from 'lucide-react';

const Reports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ежедневный');

  useEffect(() => {
    fetchReports();
  }, [activeTab]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await reportService.getReports({
        reportType: activeTab,
        sort: '-date',
        limit: 20
      });
      setReports(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке отчетов:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить отчеты',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Получение эмодзи для настроения
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'отлично': return '😄';
      case 'хорошо': return '🙂';
      case 'нейтрально': return '😐';
      case 'плохо': return '😔';
      case 'ужасно': return '😢';
      default: return '😐';
    }
  };

  // Получение цвета для карточки в зависимости от рейтинга
  const getCardColor = (rating: number) => {
    if (rating >= 8) return 'border-l-green-500';
    if (rating >= 5) return 'border-l-blue-500';
    if (rating >= 3) return 'border-l-amber-500';
    return 'border-l-red-500';
  };

  // Получение иконки для типа отчета
  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'ежедневный': return <CalendarDays className="h-5 w-5" />;
      case 'еженедельный': return <BarChart2 className="h-5 w-5" />;
      case 'ежемесячный': return <FileText className="h-5 w-5" />;
      default: return <CalendarDays className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Рефлексия</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchReports}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Обновить
          </Button>
          <Button onClick={() => navigate('/reports/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Новый отчет
          </Button>
        </div>
      </div>

      {/* Табы для переключения между типами отчетов */}
      <div className="flex border-b">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'ежедневный' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('ежедневный')}
        >
          Ежедневные
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'еженедельный' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('еженедельный')}
        >
          Еженедельные
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'ежемесячный' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('ежемесячный')}
        >
          Ежемесячные
        </button>
      </div>

      {/* Список отчетов */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <Card 
              key={report._id} 
              className={`cursor-pointer border-l-4 ${getCardColor(report.rating)}`}
              onClick={() => navigate(`/reports/${report._id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{formatDate(report.date)}</CardTitle>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    {getReportTypeIcon(report.reportType)}
                    <span className="text-xs capitalize">{report.reportType}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Оценка дня</p>
                    <p className="text-2xl font-bold">{report.rating}/10</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Настроение</p>
                    <p className="text-2xl">{getMoodEmoji(report.mood)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Выполнено задач:</span>
                    <span className="font-medium">{report.taskStats.completedCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Не выполнено:</span>
                    <span className="font-medium">{report.taskStats.failedCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Общий прогресс:</span>
                    <span className="font-medium">{report.overallProgress}%</span>
                  </div>
                </div>

                {report.nextPeriodGoals && report.nextPeriodGoals.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-1">Цели:</p>
                    <ul className="text-sm text-muted-foreground">
                      {report.nextPeriodGoals.slice(0, 2).map((goal, index) => (
                        <li key={index} className="truncate">• {goal.title}</li>
                      ))}
                      {report.nextPeriodGoals.length > 2 && (
                        <li>• ... и ещё {report.nextPeriodGoals.length - 2}</li>
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-medium">Нет отчетов</h2>
          <p className="text-muted-foreground">
            Создайте свой первый {activeTab} отчет для рефлексии
          </p>
          <Button onClick={() => navigate('/reports/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Создать отчет
          </Button>
        </div>
      )}
    </div>
  );
};

export default Reports; 