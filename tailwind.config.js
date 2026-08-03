/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#ffffff',
          100: '#faf7f2',
          200: '#f0ebe3',
          300: '#e2dccf',
          400: '#c9c0ad',
          500: '#a89e87',
          600: '#8a7f66',
        },
        forest: {
          50:  '#ccead6',
          100: '#b0cdbb',
          200: '#98b5a3',
          300: '#7a9b8a',
          400: '#5a7a68',
          500: '#4a6a58',
          600: '#3a5a48',
          700: '#2a4a38',
        },
        choco: {
          50:  '#3a2a1e',
          100: '#2e2014',
          200: '#241810',
          300: '#1c1208',
          400: '#160d04',
          500: '#100a03',
          600: '#0a0602',
          700: '#080501',
        },
        gold: {
          100: '#ffdea5',
          200: '#e9c176',
          300: '#d4a851',
          400: '#b8903a',
          500: '#8a6a1e',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Literata', 'Georgia', 'serif'],
        label: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px 0 rgba(0,0,0,0.30), 0 1px 2px -1px rgba(0,0,0,0.20)',
        'warm-md': '0 4px 16px 0 rgba(0,0,0,0.35), 0 2px 6px -2px rgba(0,0,0,0.25)',
        'warm-lg': '0 10px 32px 0 rgba(0,0,0,0.40), 0 4px 12px -4px rgba(0,0,0,0.30)',
        'warm-xl': '0 20px 48px 0 rgba(0,0,0,0.50), 0 8px 20px -6px rgba(0,0,0,0.35)',
        'glow-gold': '0 0 24px 0 rgba(233,193,118,0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
