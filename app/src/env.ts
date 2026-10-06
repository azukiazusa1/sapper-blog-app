import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  PUBLIC_ANALYTICS_ID: { public: true, static: true },
  PUBLIC_BASE_URL: { public: true, static: true },
  PUBLIC_OGP_BASE_URL: { public: true, static: true },
  API_KEY: { static: true },
  PREVIEW_API_KEY: { static: true },
  SPACE: { static: true },
  ENVIRONMENTS: { static: true },
  GITHUB_TOKEN: { static: true },
  PRIVATE_KEY: { static: true },
  CLIENT_EMAIL: { static: true },
  PROPERTY_ID: { static: true },
});
