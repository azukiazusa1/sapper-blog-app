import * as contentful from 'contentful-management'
import { Env } from './env'

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
  const environment = await space.getEnvironment(Env.environment)
  cache = {
    ...cache,
    environment,
  }
  return environment
}
