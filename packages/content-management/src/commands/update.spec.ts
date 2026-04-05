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
  test("日本語と英語が同時追加された場合は日本語を作成後に英語ロケールを更新する", async () => {
    process.env["ADDED_FILES"] =
      "contents/blogPost/sample-post.md contents/blogPost/en/sample-post.md";

    mocks.loadBlogPost.mockResolvedValue({
      success: true,
      data: {
        id: "sample-post",
        title: "title",
        about: "about",
        article: "article",
        createdAt: "2026-04-01T00:00+09:00",
        updatedAt: "2026-04-01T00:00+09:00",
        slug: "sample-post",
        tags: [],
        thumbnail: {
          url: "https://images.ctfassets.net/3",
          title: "title",
        },
        published: true,
      },
    });

    await import("./update.ts");

    expect(mocks.loadBlogPost).toHaveBeenNthCalledWith(1, "sample-post");
    expect(mocks.createBlogPost).toHaveBeenCalledTimes(1);
    expect(mocks.createBlogPost).toHaveBeenCalledWith(
      expect.objectContaining({ id: "sample-post" }),
      { publish: false },
    );
    expect(mocks.loadBlogPost).toHaveBeenNthCalledWith(
      2,
      "sample-post",
      "en-GB",
    );
    expect(mocks.updateBlogPost).toHaveBeenCalledWith(
      expect.objectContaining({ id: "sample-post" }),
      "en-GB",
    );
    const createOrder = mocks.createBlogPost.mock.invocationCallOrder[0];
    const updateOrder = mocks.updateBlogPost.mock.invocationCallOrder[0];

    expect(createOrder).toBeDefined();
    expect(updateOrder).toBeDefined();
    expect(createOrder as number).toBeLessThan(updateOrder as number);
  });

  test("追加ファイルの並びが英語先頭でも日本語作成後に英語ロケールを更新する", async () => {
    process.env["ADDED_FILES"] =
      "contents/blogPost/en/sample-post.md contents/blogPost/sample-post.md";

    mocks.loadBlogPost.mockResolvedValue({
      success: true,
      data: {
        id: "sample-post",
        title: "title",
        about: "about",
        article: "article",
        createdAt: "2026-04-01T00:00+09:00",
        updatedAt: "2026-04-01T00:00+09:00",
        slug: "sample-post",
        tags: [],
        thumbnail: {
          url: "https://images.ctfassets.net/3",
          title: "title",
        },
        published: true,
      },
    });

    await import("./update.ts");

    expect(mocks.createBlogPost).toHaveBeenCalledWith(
      expect.objectContaining({ id: "sample-post" }),
      { publish: false },
    );
    expect(mocks.updateBlogPost).toHaveBeenCalledWith(
      expect.objectContaining({ id: "sample-post" }),
      "en-GB",
    );
    const createOrder = mocks.createBlogPost.mock.invocationCallOrder[0];
    const updateOrder = mocks.updateBlogPost.mock.invocationCallOrder[0];

    expect(createOrder as number).toBeLessThan(updateOrder as number);
  });

  test("日本語のみ追加された場合は作成時に publish を抑止しない", async () => {
    process.env["ADDED_FILES"] = "contents/blogPost/sample-post.md";

    mocks.loadBlogPost.mockResolvedValue({
      success: true,
      data: {
        id: "sample-post",
        title: "title",
        about: "about",
        article: "article",
        createdAt: "2026-04-01T00:00+09:00",
        updatedAt: "2026-04-01T00:00+09:00",
        slug: "sample-post",
        tags: [],
        thumbnail: {
          url: "https://images.ctfassets.net/3",
          title: "title",
        },
        published: true,
      },
    });

    await import("./update.ts");

    expect(mocks.createBlogPost).toHaveBeenCalledWith(
      expect.objectContaining({ id: "sample-post" }),
      { publish: true },
    );
    expect(mocks.updateBlogPost).not.toHaveBeenCalled();
  });

  test("英語のみ追加された場合は既存エントリの en-GB ロケールのみ更新する", async () => {
    process.env["ADDED_FILES"] = "contents/blogPost/en/sample-post.md";

    mocks.loadBlogPost.mockResolvedValue({
      success: true,
      data: {
        id: "sample-post",
        title: "English title",
        about: "English about",
        article: "English article",
        createdAt: "2026-04-01T00:00+09:00",
        updatedAt: "2026-04-01T00:00+09:00",
        slug: "sample-post",
        tags: [],
        thumbnail: {
          url: "https://images.ctfassets.net/3",
          title: "title",
        },
        published: true,
      },
    });

    await import("./update.ts");

    expect(mocks.loadBlogPost).toHaveBeenCalledWith("sample-post", "en-GB");
    expect(mocks.createBlogPost).not.toHaveBeenCalled();
    expect(mocks.updateBlogPost).toHaveBeenCalledWith(
      expect.objectContaining({ id: "sample-post" }),
      "en-GB",
    );
  });

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
