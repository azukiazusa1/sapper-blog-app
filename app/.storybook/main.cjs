const path = require('path')
const { mergeConfig } = require('vite')
module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-a11y"),
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
    getAbsolutePath("storybook-addon-themes"),
    '@chromatic-com/storybook'
  ],
  framework: {
    name: getAbsolutePath("@storybook/sveltekit"),
    options: {},
  },

  docs: {},
  async viteFinal(config, { configType }) {
    console.log(process.env.GH_PAGE, 'NODE_ENV')
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
