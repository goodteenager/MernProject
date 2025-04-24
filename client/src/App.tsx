import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/Toaster.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Макеты
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Страницы
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import CreateTask from './pages/CreateTask';
import Reports from './pages/Reports';
import CreateReport from './pages/CreateReport';

import Settings from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<AuthLayout />}>
                <Route index element={<Navigate to="/login" replace />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>

              <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="tasks/create" element={<CreateTask />} />
                <Route path="tasks/:id" element={<TaskDetail />} />
                <Route path="reports" element={<Reports />} />
                <Route path="reports/create" element={<CreateReport />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;