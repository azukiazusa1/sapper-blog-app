module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    es6: true,
    browser: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  plugins: [
    'svelte3'
  ],
  ignorePatterns: [
    'public/build/'
  ],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  rules: {
    'no-var': 'error'
  },
  settings: {
    // Nothing
  }
}