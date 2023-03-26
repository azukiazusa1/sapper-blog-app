import { beforeAll, beforeEach, afterAll, vi } from 'vitest'
import { server } from './server'

vi.mock('$env/static/private', () => ({
  API_KEY: 'API_KEY',
  PREVIEW_API_KEY: 'PREVIEW_API_KEY',
  SPACE: 'SPACE',
  ENVIRONMENTS: 'ENVIRONMENTS',
  GITHUB_TOKEN: 'GITHUB_TOKEN',
}))

vi.mock('$env/static/public', () => ({
  PUBLIC_ANALYTICS_ID: 'PUBLIC_ANALYTICS_ID',
  PUBLIC_BASE_URL: 'PUBLIC_BASE_URL',
}))

beforeAll(() => {
  server.listen()
})

beforeEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
