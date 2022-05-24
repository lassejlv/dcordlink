module.exports = {
  content: ["./src/views/**/*.{ejs,js}"],
  theme: {
    extend: {
      colors: {
        dark: {
          100: "#23272A",
          200: "#2c3236",
          300: "#383e45",
          400: "#121417",
        },
        blue: {
          100: "#5865F2",
          200: "#505de6",
        },
        green: {
          100: "#43b581",
          200: "#2f9d5d",
        },
        danger: {
          100: "#f14647",
          200: "#e03e3e",
        },
      },

      fontFamily: {
        robotoMono: ["Roboto Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
