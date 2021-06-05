module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'desktop': '1200px',
      // => @media (min-width: 1440px) { ... }
    },
    colors: {
      grey: {
        dark: 'hsl(0, 0%, 59%)',
        darkest: 'hsl(0, 0%, 17%)',
      }
    },
    minHeight: {
      '1/4': '25%',
      '1/3': '33%',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
