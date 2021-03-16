const tailwindcss = require("tailwindcss");

// only needed if you want to purge
const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./src/**/*.svelte", "./src/**/*.html"],
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
  safelist: ['toc', 'toc-item', 'toc-level', 'toc-link', 'icon-link', 'hint', 'tip', 'warn', 'error', 'table', 'th', 'td']
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