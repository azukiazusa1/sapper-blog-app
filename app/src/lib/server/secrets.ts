import {
  API_KEY,
  PREVIEW_API_KEY,
  SPACE,
  ENVIRONMENTS,
  GITHUB_TOKEN,
  PRIVATE_KEY,
  CLIENT_EMAIL,
  PROPERTY_ID,
} from "$env/static/private";

const secrets = {
  apiKey: API_KEY,
  previewApiKey: PREVIEW_API_KEY,
  space: SPACE,
  environments: ENVIRONMENTS,
  githubToken: GITHUB_TOKEN,
  privateKey: PRIVATE_KEY.split(String.raw`\n`).join("\n"),
  clientEmail: CLIENT_EMAIL,
  propertyId: PROPERTY_ID,
} as const;

export default secrets;
