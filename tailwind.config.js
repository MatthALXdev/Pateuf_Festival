/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Caesar Dressing"', 'sans-serif'],
        caesar: ['"Caesar Dressing"', 'cursive'],
      },
      colors: {
        _beige: '#E5C992',
        _black: '#0A0113',
        _blue: '#6A96A0',
        _geen: '#99B84F',
        _brown: '#A7643A',
        _white: '#F5FDF4',
        _darkBlue: '#17102F',
      },
    },
  },
  plugins: [],
}
