// Функция для форматирования даты
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Не указано';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

// Функция для форматирования времени
export const formatTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Функция для форматирования даты и времени
export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Не указано';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Функция для форматирования относительной даты (сегодня, вчера и т.д.)
export const formatRelativeDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Не указано';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Обнуляем время для корректного сравнения дат
  const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowWithoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = dateWithoutTime.getTime() - nowWithoutTime.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Завтра';
  if (diffDays === -1) return 'Вчера';
  
  return formatDate(dateString);
};

// Функция для форматирования процентов
export const formatPercent = (value: number): string => {
  return `${Math.round(value)}%`;
}; 