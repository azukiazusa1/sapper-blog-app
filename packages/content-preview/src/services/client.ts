import * as contentful from 'contentful-management'
import { Env } from './env.js'

type Cache = {
  environment?: contentful.Environment
}
let cache: Cache = {}

export const createClient = async () => {
  if (cache.environment) {
    return cache.environment
  }
  const client = contentful.createClient({
    accessToken: Env.accessToken,
  })

  const space = await client.getSpace(Env.space)
  const environment = await space.getEnvironment('test')
  cache = {
    ...cache,
    environment,
  }
  return environment
}
