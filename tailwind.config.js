/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#137fec",
          50: "#eff8ff",
          100: "#dff0fe",
          200: "#b8e3fe",
          300: "#78d0fd",
          400: "#30bafc",
          500: "#0aa3ed",
          600: "#137fec",
          700: "#0064be",
          800: "#05549a",
          900: "#0a4781",
          950: "#072c50",
        },
      },
    },
  },
  plugins: [],
};
