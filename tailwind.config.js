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
        chronos: {
          bg: '#080b11',
          'bg-deep': '#04060a',
          card: '#0d131f',
          'card-hover': '#111928',
          panel: '#0a0f19',
          'panel-border': '#1b2438',
          'panel-border-bright': '#2a3b5c',
          pink: '#ff3366',
          'pink-glow': '#ff1753',
          'pink-dark': '#4a1525',
          cyan: '#00f0ff',
          'cyan-glow': '#00d2df',
          'cyan-dark': '#0c3547',
          green: '#00ff9d',
          'green-dark': '#0d3829',
          yellow: '#f59e0b',
          purple: '#a855f7',
          blue: '#3b82f6',
          text: '#e2e8f0',
          'text-muted': '#7e8fa6',
          'text-dim': '#48566e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
        display: ['Cinzel', '"Space Grotesk"', 'serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'glow-pink': '0 0 20px rgba(255, 51, 102, 0.45)',
        'glow-pink-sm': '0 0 10px rgba(255, 51, 102, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.4)',
        'glow-cyan-sm': '0 0 10px rgba(0, 240, 255, 0.25)',
        'glow-green': '0 0 15px rgba(0, 255, 157, 0.35)',
        'card-glow': '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.8))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 2px rgba(0, 240, 255, 0.3))' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
