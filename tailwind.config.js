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
    },
  },
  plugins: [require("daisyui")],
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
