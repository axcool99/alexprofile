/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne:  ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        cn:    ['"Noto Serif SC"', 'serif'],
      },
      colors: {
        bg: '#0A0A0A',
        'bg-2': '#111111',
        'bg-card': '#161616',
        orange: '#FF5C28',
        gold: '#C9A84C',
      },
    },
  },
  plugins: [],
}
