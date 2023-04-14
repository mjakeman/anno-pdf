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
        'anno-space-750': '#504A77',
        'anno-space-700': '#5A5578', // Dark mode - Background
        'anno-space-100': '#CAC6DD',
        'anno-red-primary': '#CA2D37',
        'anno-red-secondary' : '#EB4E54',
        'anno-pink-500': '#FF99A7',
        'anno-pink-200': '#FFCED5',
        'anno-pink-100': '#FFEAED',
      },
      fontFamily: {
        'halant': ['Halant', 'sans-serif'],
        'karla' : ['Karla', 'sans-serif'],
        'sans': ['Karla', ...defaultTheme.fontFamily.sans], // Sets default font
      },
      dropShadow: {
        'around': '0 1px 2px rgba(0, 0, 0, 0.4)',
      },
      // Custom widths
      // Note that they should adhere to step of each increment being 0.25rem i.e. w-1 = 0.25rem, w-2 = 0.5rem.
      width: {
        '104': '26rem',
        '180' : '45rem',
      },
      fontSize: {
        '2xs': ['0.625rem', {
          lineHeight: '0.75rem',
        }]
      }
    },
  },
  plugins: [],
}
