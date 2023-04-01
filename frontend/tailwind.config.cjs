/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');


module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'anno-space-900': '#312D45', // dark mode - app header
        'anno-space-800': '#3F3B56', // dark mode - toolbar
        'anno-space-700': '#5A5578', // dark mode bg
        'anno-space-100': '#CAC6DD',
        'anno-red-primary': '#CA2D37',
        'anno-red-secondary' : '#EB4E54',
        'anno-pink': '#FF99A7',
      },
      fontFamily: {
        'halant': ['Halant', 'sans-serif'],
        'karla' : ['Karla', 'sans-serif'],
        'sans': ['Karla', ...defaultTheme.fontFamily.sans], // Sets default font
      },
      dropShadow: {
        'around': '0 1px 2px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
