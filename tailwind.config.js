/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5B4FE9',
          50: '#F4F3FF',
          100: '#EBE9FF',
          200: '#D9D6FF',
          300: '#BEB8FF',
          400: '#A193FF',
          500: '#8B5CF6',
          600: '#7C71FF',
          700: '#5B4FE9',
          800: '#4C3BC4',
          900: '#3F2F9F',
        },
        accent: '#FF6B6B',
        success: '#34D399',
        warning: '#FFA726',
        error: '#FF5252',
        info: '#4FC3F7',
        surface: '#FFFFFF',
        background: '#F7F8FC',
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'fab': '0 4px 12px rgba(91, 79, 233, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale': 'scale 0.2s ease-out',
      },
      keyframes: {
        scale: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}