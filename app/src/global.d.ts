declare module '$env/static/private' {
  const API_KEY: string | undefined
  const PREVIEW_API_KEY: string | undefined
  const SPACE: string | undefined
  const ENVIRONMENTS: string | undefined
}
declare module '$env/static/public' {
  export const PUBLIC_ANALYTICS_ID: string | undefined
  export const PUBLIC_BASE_URL: string | undefined
}
