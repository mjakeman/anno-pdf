/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');


module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'halant': ['Halant', 'sans-serif'],
        'karla' : ['Karla', 'sans-serif'],
        'sans': ['Karla', ...defaultTheme.fontFamily.sans], // Sets default font
      },
    },
  },
  plugins: [],
}
