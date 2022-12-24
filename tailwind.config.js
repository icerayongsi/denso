/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,ejs}"],
  theme: {
    extend: {
      colors: {
        'black-rgb': 'rgb(33 37 41 / 0.8)',
      },
    },
  },
  plugins: [],
  prefix: 'tw-',
  important: true,
}
