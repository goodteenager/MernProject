import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import useLogger from '../hooks/useLogger';
import {
  Lock,
  Mail,
  User,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  Flame
} from 'lucide-react';

const Register: React.FC = () => {
  // States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Hooks
  const { register, loading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const logger = useLogger('RegisterPage');

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
      case 'username':
        if (!value) errorMessage = 'Имя героя обязательно';
        else if (value.length < 3) errorMessage = 'Минимум 3 символа';
        break;
      case 'email':
        if (!value) errorMessage = 'Магический кристалл обязателен';
        else if (!/\S+@\S+\.\S+/.test(value)) errorMessage = 'Неверный формат';
        break;
      case 'password':
        if (!value) errorMessage = 'Заклинание обязательно';
        else if (value.length < 6) errorMessage = 'Минимум 6 символов';
        break;
      case 'confirmPassword':
        if (!value) errorMessage = 'Подтвердите заклинание';
        else if (value !== formData.password) errorMessage = 'Заклинания не совпадают';
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
      username: validateField('username', formData.username),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword)
    };

    setFormErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some(error => error)) {
      setError('Пожалуйста, исправьте ошибки в форме');
      setIsLoading(false);
      return;
    }

    try {
      logger.info('Попытка регистрации', { email: formData.email, username: formData.username });

      // Simulated delay for visual feedback
      setTimeout(async () => {
        try {
          await register(formData.username, formData.email, formData.password);
          setSuccess('Портал создан! Перемещение в мир IYouWe...');
          setShowSuccessAnimation(true);

          // Redirect after success animation
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } catch (err: any) {
          logger.error('Ошибка регистрации', { error: err.message });
          setError(err.response?.data?.message || 'Ошибка регистрации. Проверьте данные.');
          setIsLoading(false);
        }
      }, 1500);
    } catch (err: any) {
      logger.error('Ошибка регистрации', { error: err.message });
      setError(err.response?.data?.message || 'Ошибка регистрации. Проверьте данные.');
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

      {/* Success portal animation */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-400 rounded-full animate-ping opacity-20" />
            <div className="w-64 h-64 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-400 flex items-center justify-center animate-pulse">
              <Flame className="h-32 w-32 text-white animate-bounce" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-xl font-bold animate-pulse">{success}</p>
            </div>
          </div>
        </div>
      )}

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
                  Создай героя и начни приключение
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
                  {/* Username field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-cyan-300 flex items-center gap-1">
                      <User size={12} /> Имя героя
                    </label>
                    <div className="relative">
                      <input
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="IYouWe"
                        className={`w-full bg-gray-800/60 border ${
                          formErrors.username ? 'border-red-500/50' : 'border-indigo-500/20 focus:border-indigo-500/60'
                        } rounded-lg p-2 pl-8 text-gray-100 outline-none transition-all duration-300 text-sm`}
                      />
                      <User className="absolute left-2.5 top-2.5 text-indigo-400" size={16} />
                      {formData.username && (
                        <div className="absolute right-2.5 top-2.5">
                          {formErrors.username ? (
                            <XCircle size={16} className="text-red-400" />
                          ) : (
                            <CheckCircle2 size={16} className="text-green-400" />
                          )}
                        </div>
                      )}
                    </div>
                    {formErrors.username && (
                      <p className="text-red-400 text-xs">{formErrors.username}</p>
                    )}
                  </div>

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
                      {formData.email && (
                        <div className="absolute right-2.5 top-2.5">
                          {formErrors.email ? (
                            <XCircle size={16} className="text-red-400" />
                          ) : (
                            <CheckCircle2 size={16} className="text-green-400" />
                          )}
                        </div>
                      )}
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
                    {formData.password && !formErrors.password && (
                      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            formData.password.length < 8 ? 'bg-red-500' :
                              formData.password.length < 10 ? 'bg-yellow-500' : 'bg-green-500'
                          } transition-all duration-300`}
                          style={{ width: `${Math.min(100, formData.password.length * 10)}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Confirm password field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-cyan-300 flex items-center gap-1">
                      <Lock size={12} /> Повторите заклинание
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={confirmPasswordVisible ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={`w-full bg-gray-800/60 border ${
                          formErrors.confirmPassword ? 'border-red-500/50' : 'border-indigo-500/20 focus:border-indigo-500/60'
                        } rounded-lg p-2 pl-8 pr-8 text-gray-100 outline-none transition-all duration-300 text-sm`}
                      />
                      <Lock className="absolute left-2.5 top-2.5 text-indigo-400" size={16} />
                      <button
                        type="button"
                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                        className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        {confirmPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="text-red-400 text-xs">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Submit button - more minimalist */}
                <div className="relative group">
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
                        Создание портала...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-1" />
                        Начать приключение
                        <ArrowRight className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Login link */}
              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-xs text-cyan-300 hover:text-cyan-200 transition-colors group"
                >
                  Уже имеешь магический артефакт?
                  <span className="ml-1 inline-flex items-center group-hover:underline">
                    Войти <ArrowRight className="ml-0.5 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
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

export default Register;