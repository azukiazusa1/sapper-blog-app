const paths = require('./testedPaths.cjs')

module.exports = {
  ci: {
    upload: {
      target: 'temporary-public-storage',
    },
    collect: {
      startServerCommand: 'npm run preview',
      url: paths,
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
      },
    },
  },
}
