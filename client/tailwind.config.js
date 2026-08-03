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
        background: '#0B0D12',
        surface: 'rgba(255, 255, 255, 0.04)',
        'surface-hover': 'rgba(255, 255, 255, 0.07)',
        'glass-border': 'rgba(255, 255, 255, 0.08)',
        ink: {
          DEFAULT: '#F2F0EA',
          muted: '#9A9CAA',
          faint: '#5C5F6E',
        },
        gold: {
          DEFAULT: '#C9A25C',
          dim: '#9C7C42',
        },
        violet: {
          DEFAULT: '#6C5CE7',
          dim: '#4E42A8',
        },
        success: '#3FB77D',
        danger: '#E5675C',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'gold-glow': '0 0 35px -5px rgba(201, 162, 92, 0.35)',
        'violet-glow': '0 0 35px -5px rgba(108, 92, 231, 0.35)',
      },
    },
  },
  plugins: [],
};
