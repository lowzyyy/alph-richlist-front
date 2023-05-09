/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "450px",
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        roboto: ["var(--font-roboto)"],
      },
      keyframes: {
        slide_from_left_1: {
          "0%": { transform: "translate(0%,-15%)" },
          "100%": { transform: "translate(0%,20%) " },
        },
        slide_from_left_2: {
          "0%": { transform: "translate(0%,-20%)" },
          "100%": { transform: "translate(0%,25%) " },
        },
        slide_from_left_3: {
          "0%": { transform: "translate(0%,-40%)" },
          "100%": { transform: "translate(0%,30%) " },
        },
        fadeIn: {
          "0%": { opacity: "0.1" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        slideFromLeft1: "slide_from_left_1 0.3s forwards",
        slideFromLeft2: "slide_from_left_2 0.3s forwards",
        slideFromLeft3: "slide_from_left_3 0.3s forwards",
        fadeIn: "fadeIn 0.4s forwards",
      },
    },
  },
  plugins: [],
};
