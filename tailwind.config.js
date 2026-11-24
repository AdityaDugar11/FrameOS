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
          950: '#070a0f',
          900: '#0b0f17',
          850: '#101622',
          800: '#161e2e',
          700: '#202b40',
          600: '#2c3a54',
        },
        cyber: {
          blue: '#00d0e6',
          violet: '#7c3aed',
          red: '#f43f5e',
          green: '#10b981',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
