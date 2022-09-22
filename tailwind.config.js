/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        tablet: "640px",
        desktop: "1040px",
        large: "1280px",
      },
    },
  },
  plugins: [],
};
