/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        saffron: {
          DEFAULT: '#ea580c',
          light: '#f97316',
          dark: '#c2410c',
        },
        crimson: {
          DEFAULT: '#991b1b',
          light: '#b91c1c',
          dark: '#7f1d1d',
          deep: '#8B0000',
          ruby: '#a8111b',
        },
        ivory: {
          DEFAULT: '#faf7f0',
          light: '#fcfaf5',
          warm: '#f5f0e4',
          dark: '#ede5d4',
        },
        gold: {
          DEFAULT: '#d97706',
          accent: '#eab308',
          subtle: '#ca8a04',
        },
        charcoal: {
          900: '#121214',
          800: '#1c1917',
          700: '#292524',
          600: '#44403c',
        },
        cream: {
          50: '#fdfbf7',
          100: '#fbf8f2',
          200: '#f5f0e4',
          300: '#e8dfd1',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
