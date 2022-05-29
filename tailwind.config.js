const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      smx: "400px",
      smxl: "500px",
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        navbarTitle: ['Dancing Script', "cursive"],
        navbar: ['IBM Plex Sans', "sans-serif"],
        homeTitle: ['Josefin Sans', "sans-serif"]
      },
      colors: {
        "green-standard": "rgb(22 163 74)"
      },
      screens: {
        mdx: "850px",
        xls: "1152px"
      }
    },
  },
  plugins: [],
}