import { API_KEY, PREVIEW_API_KEY, SPACE, ENVIRONMENTS } from '$env/static/private'

if (typeof API_KEY === 'undefined') {
  throw new Error('API_KEY is not defined')
}

if (typeof PREVIEW_API_KEY === 'undefined') {
  throw new Error('PREVIEW_API_KEY is not defined')
}

if (typeof SPACE === 'undefined') {
  throw new Error('SPACE is not defined')
}

if (typeof ENVIRONMENTS === 'undefined') {
  throw new Error('ENVIRONMENTS is not defined')
}

const secrets = {
  apiKey: API_KEY,
  previewApiKey: PREVIEW_API_KEY,
  space: SPACE,
  environments: ENVIRONMENTS,
} as const

export default secrets
