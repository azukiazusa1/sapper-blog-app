import { PUBLIC_ANALYTICS_ID, PUBLIC_BASE_URL } from '$env/static/public'

if (typeof PUBLIC_ANALYTICS_ID === 'undefined') {
  throw new Error('PUBLIC_ANALYTICS_ID is undefined')
}

if (typeof PUBLIC_BASE_URL === 'undefined') {
  throw new Error('PUBLIC_BASE_URL is undefined')
}

const variables = {
  analyticsId: PUBLIC_ANALYTICS_ID,
  baseURL: PUBLIC_BASE_URL,
} as const

export default variables
