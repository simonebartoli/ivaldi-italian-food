module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      smx: "400px",
      smxl: "500px",
      sm: "640px",
      md: "768px",
      mdx: "850px",
      mdxl: "950px",
      lg: "1024px",
      xls: "1152px",
      xlsx: "1252px",
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
      animation: {
        slideLeft: "slideLeft 0.55s ease-in-out forwards",
        comeFromRight: "comeFromRight 0.5s ease-in-out forwards",
        slideRight: "slideRight 0.5s ease-in-out forwards",
        comeFromLeft: "comeFromLeft 0.5s ease-in-out forwards",
        slideDown: "slideDown 0.25s ease-in-out forwards",
        slideUp: "slideUp 0.25s ease-in-out forwards"
      }
    },
  },
  plugins: [],
}