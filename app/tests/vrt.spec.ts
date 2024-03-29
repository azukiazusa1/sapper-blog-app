import { test, expect } from '@playwright/test'
import paths from '../../testedPaths.cjs'

for (const path of paths) {
  test(`VRT: ${path}`, async ({ page }) => {
    await page.route('**/*', (route) => {
      return route.request().resourceType() === 'image' ? route.abort() : route.continue()
    })
    await page.goto(`http://localhost:3000${path}`)
    await expect(page).toHaveScreenshot({
      fullPage: true,
      scale: 'device',
      maxDiffPixels: 100,
    })
  })

  test(`VRT: ${path} (dark)`, async ({ page }) => {
    page.emulateMedia({ colorScheme: 'dark' })
    await page.route('**/*', (route) => {
      return route.request().resourceType() === 'image' ? route.abort() : route.continue()
    })
    await page.goto(`http://localhost:3000${path}`)
    await expect(page).toHaveScreenshot({
      fullPage: true,
      scale: 'device',
      maxDiffPixels: 100,
    })
  })
}
