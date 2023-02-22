import { beforeAll, beforeEach, afterAll } from 'vitest'
import _fetch from 'node-fetch'
import { server } from './server'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.fetch = _fetch

beforeAll(() => {
  server.listen()
})

beforeEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
