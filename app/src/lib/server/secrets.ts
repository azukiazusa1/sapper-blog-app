import {
  API_KEY,
  PREVIEW_API_KEY,
  SPACE,
  ENVIRONMENTS,
  GITHUB_TOKEN,
} from "$env/static/private";

const secrets = {
  apiKey: API_KEY,
  previewApiKey: PREVIEW_API_KEY,
  space: SPACE,
  environments: ENVIRONMENTS,
  githubToken: GITHUB_TOKEN,
} as const;

export default secrets;
