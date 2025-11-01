/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "login-btn": "#E7A01C",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        baloo: ["Baloo 2", "cursive"],
      },
    },
  },
  plugins: [],
};
