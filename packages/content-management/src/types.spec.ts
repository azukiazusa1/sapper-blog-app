import { describe, test, expect } from "vitest";
import { BlogPostSchema } from "./types.ts";

const basePost = {
  id: "aU3AJ8y-gPMSvWfAfMh2y",
  title: "タイトル",
  slug: "example-slug",
  about: "概要",
  createdAt: "2026-09-05T13:33+09:00",
  updatedAt: "2026-09-05T13:33+09:00",
  tags: ["React"],
  thumbnail: {
    url: "https://images.ctfassets.net/in6v9lxmm5c8/xxx/yyy/thumbnail.png",
    title: "サムネイル",
  },
  published: true as const,
};

const parse = (article: string, published = true) =>
  BlogPostSchema.safeParse({ ...basePost, article, published });

const errorMessages = (result: ReturnType<typeof parse>) =>
  result.success ? [] : result.error.issues.map((i) => i.message);

describe("BlogPostSchema の article", () => {
  test("アップロード済みの画像 URL は通る", () => {
    const result = parse(
      "![説明](https://images.ctfassets.net/in6v9lxmm5c8/xxx/yyy/example-slug-1.png)",
    );
    expect(result.success).toBe(true);
  });

  test("プロトコル相対の画像 URL も通る", () => {
    const result = parse(
      "![説明](//images.ctfassets.net/in6v9lxmm5c8/xxx/yyy/example-slug-1.png)",
    );
    expect(result.success).toBe(true);
  });

  test("アップロード済みの動画 URL は通る", () => {
    const result = parse(
      "!v(https://downloads.ctfassets.net/in6v9lxmm5c8/xxx/yyy/example-slug-1.mp4 1280x720)",
    );
    expect(result.success).toBe(true);
  });

  test("ローカルの画像パスが残っていると弾く", () => {
    const result = parse("![](image_1.png)");
    expect(result.success).toBe(false);
    expect(errorMessages(result).join()).toContain("image_1.png");
  });

  test("ローカルの動画パスが残っていると弾く", () => {
    const result = parse("!v(recording.mov)");
    expect(result.success).toBe(false);
    expect(errorMessages(result).join()).toContain("recording.mov");
  });

  test("プロトコル相対の動画 URL は弾く", () => {
    // remark-video は new URL() で検証するため、プロトコル相対だと再生できない
    const result = parse(
      "!v(//downloads.ctfassets.net/in6v9lxmm5c8/xxx/yyy/example-slug-1.mp4 1280x720)",
    );
    expect(result.success).toBe(false);
  });

  test("複数のローカル参照をまとめて報告する", () => {
    const result = parse("![](image.png)\n\n!v(recording.mov)");
    const message = errorMessages(result).join();
    expect(message).toContain("image.png");
    expect(message).toContain("recording.mov");
  });

  test("下書きのうちはローカルパスが残っていても通る", () => {
    const result = BlogPostSchema.safeParse({
      ...basePost,
      article: "![](image_1.png)",
      published: false,
    });
    expect(result.success).toBe(true);
  });
});
