import { useState } from 'react'
import './index.css'
import { Button } from './components/ui/button'
import LoggingControl from './components/LoggingControl'
import ThemeToggle from './components/ThemeToggle'
import useLogger from './hooks/useLogger'
import { useTheme } from './contexts/ThemeContext'

function App() {
  const logger = useLogger('AppComponent');
  const { theme } = useTheme();
  const [count, setCount] = useState(0)

  const handleIncrement = () => {
    logger.info('Кнопка увеличения счетчика нажата');
    setCount((count) => count + 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-8 bg-card p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">MERN-приложение с Docker</h1>

        <div className="text-center">
          <p className="mb-4">Тестовый счетчик: {count}</p>
          <p className="mb-4 text-muted-foreground">Текущая тема: {theme}</p>
          <Button onClick={handleIncrement}>Увеличить счетчик</Button>
        </div>

        <div className="text-sm text-muted-foreground mt-4">
          <p>Этот компонент логирует свой жизненный цикл и действия пользователя.</p>
          <p>Посмотрите консоль браузера, чтобы увидеть логи.</p>
        </div>
      </div>

      <div className="w-full max-w-md mt-8">
        <LoggingControl />
      </div>
    </div>
  )
}

export default App