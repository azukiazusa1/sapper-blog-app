import { beforeAll, beforeEach, afterAll, vi } from "vitest";
import _fetch from "node-fetch";
import { server } from "./server";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.fetch = _fetch;

vi.mock("$env/static/private", () => ({
  API_KEY: "API_KEY",
  PREVIEW_API_KEY: "PREVIEW_API_KEY",
  SPACE: "SPACE",
  ENVIRONMENTS: "ENVIRONMENTS",
  GITHUB_TOKEN: "GITHUB_TOKEN",
  PRIVATE_KEY: "PRIVATE_KEY",
  CLIENT_EMAIL: "CLIENT_EMAIL",
  PROPERTY_ID: "PROPERTY_ID",
}));

vi.mock("$env/static/public", () => ({
  PUBLIC_ANALYTICS_ID: "PUBLIC_ANALYTICS_ID",
  PUBLIC_BASE_URL: "PUBLIC_BASE_URL",
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
