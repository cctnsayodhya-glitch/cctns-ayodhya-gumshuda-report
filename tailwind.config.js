/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        police: {
          navy: '#0A192F',
          dark: '#0d2137',
          khaki: '#C2A649',
          khakiDark: '#9A802A',
          red: '#D32F2F',
          green: '#2E7D32',
          gold: '#FFD700',
          blue: '#1976D2'
        }
      },
      animation: {
        'blink-slow': 'blink 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)', boxShadow: '0 0 20px rgba(34, 197, 94, 0.8)' },
          '50%': { opacity: '0.4', transform: 'scale(1.01)', boxShadow: '0 0 5px rgba(34, 197, 94, 0.2)' },
        }
      }
    },
  },
  plugins: [],
}
