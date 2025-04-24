/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        // Добавленные кастомные цвета
        warrior: {
          DEFAULT: '#ef4444',
          light: '#fecaca',
          dark: '#991b1b'
        },
        mage: {
          DEFAULT: '#6366f1',
          light: '#c7d2fe',
          dark: '#3730a3'
        },
        ranger: {
          DEFAULT: '#22c55e',
          light: '#bbf7d0',
          dark: '#166534'
        },
        fantasy: {
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          pink: '#ec4899',
          dragon: '#dc2626'
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: '1rem'
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "slow-spin": {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        "reverse-spin": {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(-360deg)' }
        },
        "shimmer": {
          '100%': { transform: 'translateX(100%)' }
        },
        "fade-in-up": {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        "shake": {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
        },
        "portal-pulse": {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slow-spin": "slow-spin 40s linear infinite",
        "reverse-spin": "reverse-spin 50s linear infinite",
        "shimmer": "shimmer 2s infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out",
        "shake": "shake 0.5s ease-in-out",
        "portal-pulse": "portal-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      // Дополнительные кастомные настройки
      backdropBlur: {
        fantasy: '20px'
      },
      boxShadow: {
        'fantasy-sm': '0 2px 8px rgba(139, 92, 246, 0.1)',
        'fantasy-md': '0 4px 16px rgba(139, 92, 246, 0.2)',
        'fantasy-lg': '0 8px 24px rgba(139, 92, 246, 0.3)'
      },
      gradientColorStops: {
        'fantasy-start': '#8b5cf6',
        'fantasy-end': '#06b6d4'
      },
      borderColor: {
        fantasy: 'rgba(139, 92, 246, 0.2)'
      },
      transform: {
        'fantasy-hover': 'translateY(-2px)'
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/forms'),
    function ({ addUtilities }) {
      addUtilities({
        '.bg-fantasy-pattern': {
          backgroundImage: "url('https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_1280.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: '0.1'
        },
        '.text-stroke': {
          '-webkit-text-stroke': '1px currentColor',
          'text-stroke': '1px currentColor'
        },
        '.glass-effect': {
          background: 'rgba(17, 24, 39, 0.9)',
          backdropFilter: 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)'
        }
      })
    }
  ],
}