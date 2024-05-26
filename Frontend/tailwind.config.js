/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      "bg-0": "#121212",
      "bg-1": "#1D1D1D",
      "primary": "#C38FFF",
      "secondary": "#03DAC6",
      "white-0": "#E1E1E1",
      "gray": "rgb(66, 66, 66)",
      "red" : "rgb(204, 41, 41)",
      "green" : "rgb(46, 92, 32)",
    },
    extend: {},
  },
  plugins: [],
}

