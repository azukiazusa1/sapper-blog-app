const path = require('path')
const { mergeConfig } = require('vite')

function getAbsolutePath(value) {
  return path.dirname(require.resolve(path.join(value, 'package.json')))
}

module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-themes"),
    '@chromatic-com/storybook'
  ],
  framework: {
    name: getAbsolutePath("@storybook/sveltekit"),
    options: {},
  },

  docs: {},
  async viteFinal(config) {
    return mergeConfig(config, {
      base: process.env.GH_PAGE === 'true' ? '/sapper-blog-app/' : '/',
      resolve: {
        alias: {
          $lib: path.resolve(__dirname, '../src/lib'),
        },
      },
      define: {
        __SVELTEKIT_DEV__: true,
        __SVELTEKIT_APP_VERSION_POLL_INTERVAL__: 1000,
      },
    })
  },
}
