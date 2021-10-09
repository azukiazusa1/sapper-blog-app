const tailwindcss = require("tailwindcss");

// only needed if you want to purge
const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./src/**/*.svelte", "./src/**/*.html"],
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
  safelist: ['toc', 'toc-item', 'toc-level', 'toc-link', 'icon-link', 'link-card--iframe', 'hint', 'tip', 'warn', 'error', 'table', 'th', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
});

module.exports = {
  plugins: [
    tailwindcss("./tailwind.js"),
    require('cssnano')({
        preset: 'default',
    }),
    // only needed if you want to purge
    ...(process.env.NODE_ENV === "production" ? [purgecss] : [])
  ]
};