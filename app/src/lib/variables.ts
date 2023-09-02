import { PUBLIC_ANALYTICS_ID, PUBLIC_BASE_URL } from "$env/static/public";

const variables = {
  analyticsId: PUBLIC_ANALYTICS_ID,
  baseURL: PUBLIC_BASE_URL,
} as const;

export default variables;
