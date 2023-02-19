import dotenv from 'dotenv'
import findConfig from 'find-config'
dotenv.config({ path: findConfig('.env') || '' })

const { MANAGEMENT_TOKEN, SPACE, ENVIRONMENTS } = process.env

if (!MANAGEMENT_TOKEN) {
  throw new Error('.env に MANAGEMENT_TOKEN を設定してください。')
}

if (!SPACE) {
  throw new Error('.env に SPACE を設定してください。')
}

if (!ENVIRONMENTS) {
  throw new Error('.env に ENVIRONMENTS を設定してください。')
}

export const Env = {
  accessToken: MANAGEMENT_TOKEN,
  space: SPACE,
  environments: ENVIRONMENTS,
} as const satisfies Record<string, string>
