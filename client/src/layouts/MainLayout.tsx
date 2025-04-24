import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';
import MobileNav from '../components/navigation/MobileNav';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Шапка сайта */}
      <Header />

      <div className="flex flex-1">
        {/* Боковая навигация (скрыта на мобильных устройствах) */}
        <Sidebar className="hidden md:block" />

        {/* Основной контент */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Нижняя навигация для мобильных устройств */}
      {/*<MobileNav className="md:hidden" />*/}
    </div>
  );
};

export default MainLayout; 