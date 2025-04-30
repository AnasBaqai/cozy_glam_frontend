/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      animation: {
        marquee: "marquee 70s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(200%)" },
          "100%": { transform: "translateX(-200%)" },
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        sand: "#F5EFE6",
        peach: "#DFAE9E",
        cocoa: "#2E221A",
        "glam-primary": "#DFAE9E",
        "glam-light": "#F7ECE7",
        "glam-dark": "#2E221A",
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};

// Add custom utilities
const plugin = require("tailwindcss/plugin");
module.exports.plugins.push(
  plugin(function ({ addUtilities }) {
    addUtilities({
      ".pause": {
        "animation-play-state": "paused",
      },
    });
  })
);
