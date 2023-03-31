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
        'anno-space-900': '#312D45', // Dark mode - App header
        'anno-space-800': '#3F3B56', // Dark mode - Toolbar
        'anno-space-700': '#5A5578', // Dark mode - Background
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
      // Custom widths
      // Note that they should adhere to step of each increment being 0.25rem i.e. w-1 = 0.25rem, w-2 = 0.5rem.
      width: {
        '104': '26rem',
      }
    },
  },
  plugins: [],
}
