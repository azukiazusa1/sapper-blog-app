import dotenv from "dotenv";
import findConfig from "find-config";
dotenv.config({ path: findConfig(".env") || "" });

const {
  MANAGEMENT_TOKEN,
  SPACE,
  ENVIRONMENTS,
  PRIVATE_KEY,
  CLIENT_EMAIL,
  PROPERTY_ID,
} = process.env;

export const Env = {
  accessToken: MANAGEMENT_TOKEN || "",
  space: SPACE || "",
  environments: ENVIRONMENTS || "",
  privateKey: (PRIVATE_KEY || "").split(String.raw`\n`).join("\n"),
  clientEmail: CLIENT_EMAIL || "",
  propertyId: PROPERTY_ID || "",
} as const satisfies Record<string, string>;
