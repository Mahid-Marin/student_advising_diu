module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1554d9',
        'primary-dim': '#0047c6',
        'primary-container': '#4878fd',
        secondary: '#595e72',
        tertiary: '#6d567e',
        error: '#a8364b',
      },
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
