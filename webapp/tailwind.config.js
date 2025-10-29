/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF7E39',
      },
      fontFamily: {
        barriecito: ['Barriecito', 'system-ui'],
        sketch: ['Cabin Sketch', 'cursive'],
        neucha: ['Neucha', 'cursive'],
      },
    },
  },
  plugins: [],
};
