const paths = require('./testedPaths.cjs')

module.exports = {
  ci: {
    upload: {
      target: 'temporary-public-storage',
    },
    collect: {
      staticDistDir: './build',
      url: paths,
      numberOfRuns: 1,
    },
  },
}
