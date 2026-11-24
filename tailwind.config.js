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
        dark: {
          950: '#05070a',
          900: '#0a0e17',
          850: '#0f1422',
          800: '#141c2e',
          700: '#1e2942',
          600: '#2a3a5e',
        },
        cyber: {
          blue: '#00f0ff',
          neon: '#00d2ff',
          violet: '#8a2be2',
          purple: '#a855f7',
          red: '#ff3366',
          green: '#00ff88',
          yellow: '#ffb800',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(0, 240, 255, 0.3)',
        'glow-red': '0 0 20px -5px rgba(255, 51, 102, 0.35)',
        'glow-green': '0 0 20px -5px rgba(0, 255, 136, 0.35)',
        'glow-purple': '0 0 20px -5px rgba(168, 85, 247, 0.35)',
      }
    },
  },
  plugins: [],
}
