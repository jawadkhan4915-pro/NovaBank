/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F',
        surface: 'rgba(255, 255, 255, 0.05)',
        'surface-hover': 'rgba(255, 255, 255, 0.08)',
        'glass-border': 'rgba(255, 255, 255, 0.10)',
        aurora: {
          violet: '#8B5CF6',
          cyan: '#06B6D4',
          emerald: '#10B981',
          rose: '#F43F5E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'aurora-glow': '0 0 40px -10px rgba(139, 92, 246, 0.5)',
      },
    },
  },
  plugins: [],
};
