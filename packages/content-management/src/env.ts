import dotenv from 'dotenv'
import findConfig from 'find-config'
dotenv.config({ path: findConfig('.env') || '' })

const { MANAGEMENT_TOKEN, VITE_SPACE, VITE_ENVIRONMENTS } = process.env

if (!MANAGEMENT_TOKEN) {
  throw new Error('.env に MANAGEMENT_TOKEN を設定してください。')
}

if (!VITE_SPACE) {
  throw new Error('.env に VITE_SPACE を設定してください。')
}

if (!VITE_ENVIRONMENTS) {
  throw new Error('.env に VITE_ENVIRONMENTS を設定してください。')
}

export const Env = {
  accessToken: MANAGEMENT_TOKEN,
  space: VITE_SPACE,
  environments: VITE_ENVIRONMENTS,
} as const satisfies Record<string, string>
