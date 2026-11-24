/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#fdfbf7',
          100: '#f7f4ee',
          200: '#efe9df',
          300: '#e7e2d7',
          400: '#dcd5c7',
        },
        ink: {
          primary: '#1f1b16',
          secondary: '#5e554a',
          muted: '#7b7266',
          subtle: '#9e968a',
        },
        copper: {
          600: '#c2410c',
          700: '#9a3412',
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
