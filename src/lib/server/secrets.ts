const secrets = {
  apiKey: import.meta.env.VITE_API_KEY,
  previewApiKey: import.meta.env.VITE_PREVIEW_API_KEY,
  space: import.meta.env.VITE_SPACE,
  environments: import.meta.env.VITE_ENVIRONMENTS,
} as const

export default secrets
