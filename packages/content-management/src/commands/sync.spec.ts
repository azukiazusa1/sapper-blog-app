import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getBlogPosts: vi.fn(),
  getLocalizedBlogPosts: vi.fn(),
  createBlogFile: vi.fn(),
  deletePublishedBlogFile: vi.fn(),
}));

vi.mock("../api.ts", () => ({
  getBlogPosts: mocks.getBlogPosts,
  getLocalizedBlogPosts: mocks.getLocalizedBlogPosts,
}));

vi.mock("../fileOperation.ts", () => ({
  createBlogFile: mocks.createBlogFile,
  deletePublishedBlogFile: mocks.deletePublishedBlogFile,
}));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("commands/sync", () => {
  test("日本語と英語記事をそれぞれのロケールで同期する", async () => {
    mocks.getBlogPosts.mockResolvedValue([
      {
        id: "blog-ja",
        title: "日本語タイトル",
        about: "概要",
        article: "本文",
        createdAt: "2026-04-01T00:00+09:00",
        updatedAt: "2026-04-01T00:00+09:00",
        slug: "blog-ja",
        tags: [],
        thumbnail: {
          url: "https://images.ctfassets.net/3",
          title: "title",
        },
        published: true,
      },
    ]);
    mocks.getLocalizedBlogPosts.mockResolvedValue([
      {
        id: "blog-ja",
        title: "English title",
        about: "English about",
        article: "English article",
        createdAt: "2026-04-01T00:00+09:00",
        updatedAt: "2026-04-01T00:00+09:00",
        slug: "blog-ja",
        tags: [],
        thumbnail: {
          url: "https://images.ctfassets.net/3",
          title: "title",
        },
        published: true,
      },
    ]);

    await import("./sync.ts");

    expect(mocks.getBlogPosts).toHaveBeenCalledTimes(1);
    expect(mocks.getLocalizedBlogPosts).toHaveBeenCalledWith("en-GB");
    expect(mocks.createBlogFile).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ id: "blog-ja", title: "日本語タイトル" }),
    );
    expect(mocks.deletePublishedBlogFile).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ id: "blog-ja", title: "日本語タイトル" }),
    );
    expect(mocks.createBlogFile).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ id: "blog-ja", title: "English title" }),
      "en-GB",
    );
    expect(mocks.deletePublishedBlogFile).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ id: "blog-ja", title: "English title" }),
      "en-GB",
    );
  });

  test("英語翻訳が無い場合は英語ファイルを生成しない", async () => {
    mocks.getBlogPosts.mockResolvedValue([]);
    mocks.getLocalizedBlogPosts.mockResolvedValue([]);

    await import("./sync.ts");

    expect(mocks.createBlogFile).not.toHaveBeenCalled();
    expect(mocks.deletePublishedBlogFile).not.toHaveBeenCalled();
  });
});
