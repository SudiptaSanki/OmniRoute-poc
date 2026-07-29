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
        cream:   { 50: '#FDF6F0', 100: '#FFF0E8', 200: '#FFE8E0', 300: '#FDE8D8' },
        rose:    { 50: '#FFF0F5', 100: '#FFE0EC', 200: '#FFBDD6', 300: '#F9A8C8', 400: '#E8819E', 500: '#D4688A', 600: '#C05578' },
        warmtan: { 50: '#FAF0E6', 100: '#F0E0CC', 200: '#DEC5A8', 300: '#C9A87C', 400: '#B8935A', 500: '#9E7B4A', 600: '#7A5C36' },
        bark:    { 700: '#5D4C41', 800: '#3E2723' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
