const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: [
    "toc",
    "toc-item",
    "toc-level",
    "toc-link",
    "icon-link",
    "link-card--iframe",
    "hint",
    "tip",
    "warn",
    "error",
    "table",
    "th",
    "td",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
  ],

  darkMode: "class",

  theme: {
    extend: {
      animation: {
        "fade-in": "fade-in 0.2s ease-in-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "scale(0.6)" },
          "100%": { opacity: "1" },
        },
      },
    },
  },

  plugins: [],
};

module.exports = config;
