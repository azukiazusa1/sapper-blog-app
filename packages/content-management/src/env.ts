import dotenv from "dotenv";
import findConfig from "find-config";
dotenv.config({ path: findConfig(".env") || "" });

const { MANAGEMENT_TOKEN, SPACE, ENVIRONMENTS, OPENAI_API_KEY } = process.env;

export const Env = {
  accessToken: MANAGEMENT_TOKEN || "",
  space: SPACE || "",
  environments: ENVIRONMENTS || "",
  openaiApiKey: OPENAI_API_KEY || "",
} as const satisfies Record<string, string>;
