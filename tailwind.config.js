/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,ejs}"],
  theme: {
    extend: {
      colors: {
        'black-rgb': 'rgb(33 37 41 / 0.8)',
        'black-rgb-no-a': 'rgb(33 37 41)',
        'background' : 'rgb(33 37 41)',
        'old-gray': 'rgb(108 117 125)',
      },
    },
  },
  plugins: [],
  prefix: 'tw-',
  important: true,
}
