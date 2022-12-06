import { PlaywrightTestConfig, devices } from '@playwright/test'

const config: PlaywrightTestConfig = {
  fullyParallel: true,
  webServer: {
    command: 'npm run serve',
    port: 3000,
    reuseExistingServer: true,
  },
  expect: {
    timeout: 15000,
    toHaveScreenshot: {
      maxDiffPixels: 1000,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
}

export default config
