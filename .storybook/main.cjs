const path = require('path')
const { mergeConfig } = require('vite')
module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
    'storybook-addon-themes',
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {},
  },

  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          $lib: path.resolve(__dirname, '../src/lib'),
          $app: path.resolve(__dirname, '../.svelte-kit/dev/runtime/app'),
        },
      },
      define: {
        __SVELTEKIT_DEV__: true,
        __SVELTEKIT_APP_VERSION_POLL_INTERVAL__: 1000,
      },
    })
  },
}
