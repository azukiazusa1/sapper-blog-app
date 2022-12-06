const paths = require('./testedPaths.cjs')

const url = paths.map((path) => `http://localhost:3000${path}`)

module.exports = {
  ci: {
    upload: {
      target: 'temporary-public-storage',
    },
    collect: {
      startServerCommand: 'npm run serve',
      url,
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
      },
    },
    asserts: {
      preset: 'lighthouse:recommended',
    },
  },
}
