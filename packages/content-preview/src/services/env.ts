export const Env = {
  space: import.meta.env.PUBLIC_SPACE,
  environment: import.meta.env.PUBLIC_ENVIRONMENT,
  // ローカル環境でしか起動しない想定なので PUBLIC にしている
  accessToken: import.meta.env.PUBLIC_MANAGEMENT_TOKEN,
} as const satisfies Record<string, string>
