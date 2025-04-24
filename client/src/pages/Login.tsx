import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import useLogger from '../hooks/useLogger';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Gamepad,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Login: React.FC = () => {
  // States
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Hooks
  const { login, loading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const logger = useLogger('LoginPage');

  // Mouse follower effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Form validation
  const validateField = (name: string, value: string) => {
    let errorMessage = '';

    switch (name) {
      case 'email':
        if (!value) errorMessage = 'Магический кристалл обязателен';
        else if (!/\S+@\S+\.\S+/.test(value)) errorMessage = 'Неверный формат';
        break;
      case 'password':
        if (!value) errorMessage = 'Заклинание обязательно';
        break;
    }

    return errorMessage;
  };

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate as user types
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));

    // Clear global error when user starts typing
    if (error) setError('');
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate all fields
    const errors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password)
    };

    setFormErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some(error => error)) {
      setError('Пожалуйста, исправьте ошибки в форме');
      setIsLoading(false);
      return;
    }

    try {
      logger.info('Попытка входа', { email: formData.email });

      // Simulated delay for visual feedback
      setTimeout(async () => {
        try {
          await login(formData.email, formData.password);
          navigate('/');
        } catch (err: any) {
          logger.error('Ошибка входа', { error: err.message });
          setError(err.response?.data?.message || 'Ошибка входа. Проверьте ваши учетные данные.');
          setIsLoading(false);
        }
      }, 800);
    } catch (err: any) {
      logger.error('Ошибка входа', { error: err.message });
      setError(err.response?.data?.message || 'Ошибка входа. Проверьте ваши учетные данные.');
      setIsLoading(false);
    }
  };

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

      {/* Mouse follower light effect - more subtle */}
      <div
        className="pointer-events-none fixed w-64 h-64 rounded-full bg-gradient-to-r from-indigo-500/5 to-transparent blur-2xl"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
          transition: 'transform 0.2s ease-out'
        }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="animate-fade-in-up">
          {/* Main card - more minimalist */}
          <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-800/60 rounded-xl shadow-xl overflow-hidden">
            <div className="relative z-10 p-6 space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    IYouWe
                  </h1>
                </div>
                <p className="text-gray-300 text-sm">
                  Войдите, чтобы продолжить свой квест!
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 flex items-center gap-3 animate-shake">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Form fields */}
                <div className="space-y-4">
                  {/* Email field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-cyan-300 flex items-center gap-1">
                      <Mail size={12} /> Магический кристалл
                    </label>
                    <div className="relative">
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="iyouwe@gmail.com"
                        className={`w-full bg-gray-800/60 border ${
                          formErrors.email ? 'border-red-500/50' : 'border-indigo-500/20 focus:border-indigo-500/60'
                        } rounded-lg p-2 pl-8 text-gray-100 outline-none transition-all duration-300 text-sm`}
                      />
                      <Mail className="absolute left-2.5 top-2.5 text-indigo-400" size={16} />
                    </div>
                    {formErrors.email && (
                      <p className="text-red-400 text-xs">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Password field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-cyan-300 flex items-center gap-1">
                      <Lock size={12} /> Защитное заклинание
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={passwordVisible ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={`w-full bg-gray-800/60 border ${
                          formErrors.password ? 'border-red-500/50' : 'border-indigo-500/20 focus:border-indigo-500/60'
                        } rounded-lg p-2 pl-8 pr-8 text-gray-100 outline-none transition-all duration-300 text-sm`}
                      />
                      <Lock className="absolute left-2.5 top-2.5 text-indigo-400" size={16} />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-red-400 text-xs">{formErrors.password}</p>
                    )}
                  </div>
                </div>

                {/* Submit button - more minimalist */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300" />
                  <button
                    type="submit"
                    disabled={isLoading || loading}
                    className="relative w-full h-10 text-sm bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg shadow-md shadow-indigo-500/20 flex items-center justify-center text-white font-medium overflow-hidden"
                  >
                    {(isLoading || loading) ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Открытие портала...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-1" />
                        Продолжить квест
                        <ArrowRight className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Register link */}
              <div className="text-center pt-2">
                <Link
                  to="/register"
                  className="text-xs text-cyan-300 hover:text-cyan-200 transition-colors group"
                >
                  Нет аккаунта?
                  <span className="ml-1 inline-flex items-center group-hover:underline">
                    Начать приключение <ArrowRight className="ml-0.5 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add these keyframes to your global CSS or style tag
const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
  20%, 40%, 60%, 80% { transform: translateX(3px); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
`;
document.head.appendChild(styleSheet);

export default Login;