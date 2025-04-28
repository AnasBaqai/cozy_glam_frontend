/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        heading: ["Cormorant Garamond", "serif"],
        body: ["Montserrat", "sans-serif"],
      },
      colors: {
        "glam-dark": "#333333",
        "glam-light": "#FAF9F3",
        "glam-primary": "#D4AF37",
        "glam-accent": "#CCCCCC",
      },
    },
  },
  plugins: [],
};
