const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: ['toc', 'toc-item', 'toc-level', 'toc-link', 'icon-link', 'link-card--iframe', 'hint', 'tip', 'warn', 'error', 'table', 'th', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

  darkMode: 'class',
  
  theme: {
    extend: {},
  },

  plugins: [],
}

module.exports = config
