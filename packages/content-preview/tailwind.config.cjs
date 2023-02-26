/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  safelist: [
    'toc',
    'toc-item',
    'toc-level',
    'toc-link',
    'icon-link',
    'link-card--iframe',
    'hint',
    'tip',
    'warn',
    'error',
    'table',
    'th',
    'td',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
  ],
  theme: {
    extend: {},
  },

  plugins: [],
}

module.exports = config
