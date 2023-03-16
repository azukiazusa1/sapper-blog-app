import dotenv from 'dotenv'
import findConfig from 'find-config'
dotenv.config({ path: findConfig('.env') || '' })

const { MANAGEMENT_TOKEN, SPACE, ENVIRONMENTS, OPENAI_API_KEY } = process.env

if (!MANAGEMENT_TOKEN) {
  throw new Error('.env に MANAGEMENT_TOKEN を設定してください。')
}

if (!SPACE) {
  throw new Error('.env に SPACE を設定してください。')
}

if (!ENVIRONMENTS) {
  throw new Error('.env に ENVIRONMENTS を設定してください。')
}

if (!OPENAI_API_KEY) {
  throw new Error('.env に OPENAI_API_KEY を設定してください。')
}

export const Env = {
  accessToken: MANAGEMENT_TOKEN,
  space: SPACE,
  environments: ENVIRONMENTS,
  openaiApiKey: OPENAI_API_KEY,
} as const satisfies Record<string, string>
