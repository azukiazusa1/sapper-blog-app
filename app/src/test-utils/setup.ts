import { beforeAll, beforeEach, afterAll, vi } from "vitest";
import { server } from "./server";

vi.mock("$app/env/private", () => ({
  API_KEY: "API_KEY",
  PREVIEW_API_KEY: "PREVIEW_API_KEY",
  SPACE: "SPACE",
  ENVIRONMENTS: "ENVIRONMENTS",
  GITHUB_TOKEN: "GITHUB_TOKEN",
  PRIVATE_KEY: "PRIVATE_KEY",
  CLIENT_EMAIL: "CLIENT_EMAIL",
  PROPERTY_ID: "PROPERTY_ID",
}));

vi.mock("$app/env/public", () => ({
  PUBLIC_ANALYTICS_ID: "PUBLIC_ANALYTICS_ID",
  PUBLIC_BASE_URL: "PUBLIC_BASE_URL",
  PUBLIC_OGP_BASE_URL: "PUBLIC_OGP_BASE_URL",
}));

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
