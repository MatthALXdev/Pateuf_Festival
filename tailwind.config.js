/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        title: ['"Caesar Dressing"', 'cursive'],
        body: ['"Special Elite"', 'cursive'],
        // sans: ['"Caesar Dressing"', 'sans-serif'],
        // caesar: ['"Caesar Dressing"', 'cursive'],
        // special: ['"Special Elite"', 'cursive'],
      },
      colors: {
        _beige01: '#CCB583',
        _beige02: '#E5C992',
        _beige03: '#F2D8A9',
        _black01: '#0A0113',
        _black02: '#404040',
        _black03: '#666666',
        _blue01: '#617D87',
        _blue02: '#6A96A0',
        _blue03: '#7AAFBA',
        _green01: '#8A9F48',
        _green02: '#99B84F',
        _green03: '#AAC961',
        _brown01: '#8D5734',
        _brown02: '#A7643A',
        _brown03: '#B3755A',
        _white01: '#DBEFE3',
        _white02: '#F5FDF4',
        _white03: '#FFFFFF',
        _darkBlue01: '#17102F',
        _darkBlue02: '#422e85',
        _darkBlue03: '#6e54c4',
        invisible: 'transparent', // Définit une couleur transparente
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}
