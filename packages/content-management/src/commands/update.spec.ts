import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createBlogPost: vi.fn(),
  updateBlogPost: vi.fn(),
  deleteBlogPost: vi.fn(),
  clearBlogPostLocale: vi.fn(),
  loadBlogPost: vi.fn(),
}));

vi.mock("../api.ts", () => ({
  createBlogPost: mocks.createBlogPost,
  updateBlogPost: mocks.updateBlogPost,
  deleteBlogPost: mocks.deleteBlogPost,
  clearBlogPostLocale: mocks.clearBlogPostLocale,
}));

vi.mock("../fileOperation.ts", () => ({
  loadBlogPost: mocks.loadBlogPost,
}));

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  process.env = { ...ORIGINAL_ENV };
  delete process.env["ADDED_FILES"];
  delete process.env["MODIFIED_FILES"];
  delete process.env["DELETED_FILES"];
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("commands/update", () => {
  test("英語記事ファイル削除時は en-GB ロケールをクリアする", async () => {
    process.env["DELETED_FILES"] = "contents/blogPost/en/sample-post.md";

    await import("./update.ts");

    expect(mocks.clearBlogPostLocale).toHaveBeenCalledWith(
      "sample-post",
      "en-GB",
    );
    expect(mocks.deleteBlogPost).not.toHaveBeenCalled();
  });

  test("日本語記事ファイル削除時はエントリを削除する", async () => {
    process.env["DELETED_FILES"] = "contents/blogPost/sample-post.md";

    await import("./update.ts");

    expect(mocks.deleteBlogPost).toHaveBeenCalledWith("sample-post");
    expect(mocks.clearBlogPostLocale).not.toHaveBeenCalled();
  });
});
