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
        mac: {
          bg: '#1e1e1e',
          card: '#252526',
          sidebar: '#181818',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.05)',
          active: 'rgba(255, 255, 255, 0.1)',
          blue: '#0A84FF',
          accent: '#0A84FF',
          red: '#FF453A',
          yellow: '#FF9F0A',
          green: '#32D74B',
          purple: '#BF5AF2',
          orange: '#FF9F0A',
          teal: '#64D2FF',
          gray: '#8E8E93',
          lightBg: '#F5F5F7',
          lightSidebar: '#EBEBEB',
          lightCard: '#FFFFFF',
          lightBorder: 'rgba(0, 0, 0, 0.08)',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        'mac-window': '0 24px 70px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'mac-light': '0 20px 50px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        'mac-card': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'mac-popover': '0 12px 30px rgba(0, 0, 0, 0.35)',
      },
      backdropBlur: {
        'mac': '24px',
      }
    },
  },
  plugins: [],
}
