import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  generateOgp,
  parseGenerateInput,
  parseMarkdownFile,
  resolveMarkdownFilePath,
} from "./generate-ogp.ts";

const originalCwd = process.cwd();
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const tempRoot = resolve(repoRoot, ".tmp-ogp-generator-test");
const englishDir = resolve(tempRoot, "contents/blogPost/en");
const japaneseDir = resolve(tempRoot, "contents/blogPost");
const englishFilePath = resolve(englishDir, "fixture.md");
const japaneseFilePath = resolve(japaneseDir, "fixture.md");
const repoRelativeEnglishPath = ".tmp-ogp-generator-test/contents/blogPost/en/fixture.md";
const repoRelativeJapanesePath = ".tmp-ogp-generator-test/contents/blogPost/fixture.md";

function createDeps(overrides: Partial<Parameters<typeof generateOgp>[1]> = {}) {
  return {
    checkImageExists: vi.fn().mockResolvedValue(false),
    generateBlogOgpImage: vi.fn().mockResolvedValue(Buffer.from("blog")),
    generateShortOgpImage: vi.fn().mockResolvedValue(Buffer.from("short")),
    uploadImage: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe("generate-ogp", () => {
  beforeEach(() => {
    mkdirSync(englishDir, { recursive: true });
    mkdirSync(japaneseDir, { recursive: true });
    writeFileSync(
      englishFilePath,
      `---
slug: "english-slug"
title: "English Title"
tags: ["react"]
---
`,
    );
    writeFileSync(
      japaneseFilePath,
      `---
slug: "japanese-slug"
title: "Japanese Title"
tags:
  - name: "typescript"
  - "svelte"
---
`,
    );
    process.chdir(resolve(repoRoot, "packages/ogp-generator"));
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(tempRoot, {
      force: true,
      recursive: true,
    });
    vi.restoreAllMocks();
  });

  test("resolves repo-relative markdown paths when executed from the workspace", () => {
    expect(resolveMarkdownFilePath(repoRelativeEnglishPath)).toBe(englishFilePath);
  });

  test("parses frontmatter from a repo-relative markdown path", () => {
    const parsed = parseMarkdownFile(repoRelativeEnglishPath);

    expect(parsed.slug).toBe("english-slug");
    expect(parsed.title).toBe("English Title");
    expect(parsed.tags).toEqual(["react"]);
  });

  test("parses tag objects and strings from frontmatter", () => {
    const parsed = parseMarkdownFile(repoRelativeJapanesePath);

    expect(parsed.tags).toEqual(["typescript", "svelte"]);
  });

  test("accepts a --file argument", () => {
    const parsed = parseGenerateInput({ file: repoRelativeEnglishPath }, []);

    expect(parsed.resolvedFile).toBe(englishFilePath);
    expect(parsed.slug).toBe("english-slug");
    expect(parsed.title).toBe("English Title");
    expect(parsed.tags).toEqual(["react"]);
  });

  test("accepts a single positional file argument", () => {
    const parsed = parseGenerateInput({}, [repoRelativeEnglishPath]);

    expect(parsed.resolvedFile).toBe(englishFilePath);
    expect(parsed.slug).toBe("english-slug");
  });

  test("rejects multiple positional file arguments", () => {
    expect(() =>
      parseGenerateInput({}, [repoRelativeEnglishPath, repoRelativeJapanesePath]),
    ).toThrow("Only one positional argument is supported");
  });

  test("fails when required frontmatter fields are missing", () => {
    const invalidFilePath = resolve(englishDir, "invalid.md");
    writeFileSync(
      invalidFilePath,
      `---
slug: "missing-title"
---
`,
    );

    expect(() =>
      parseMarkdownFile(".tmp-ogp-generator-test/contents/blogPost/en/invalid.md"),
    ).toThrow("Missing required frontmatter fields");
  });

  test("fails when title is missing and no file is provided", async () => {
    await expect(
      generateOgp({ slug: "blog-slug", tags: [], title: undefined }),
    ).rejects.toThrow("--title is required (or use --file)");
  });

  test("fails when no slug, short-id, or file is provided", async () => {
    await expect(
      generateOgp({ tags: [], title: "Title Only" }),
    ).rejects.toThrow("--slug, --short-id, or --file is required");
  });

  test("generates English blog OGP under the en prefix", async () => {
    const deps = createDeps();
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    await generateOgp(parseGenerateInput({ file: repoRelativeEnglishPath }, []), deps);

    expect(deps.checkImageExists).toHaveBeenCalledWith(
      "blog/ogp/en/english-slug.png",
      expect.any(String),
    );
    expect(deps.generateBlogOgpImage).toHaveBeenCalledWith("English Title", ["react"]);
    expect(deps.uploadImage).toHaveBeenCalledWith(
      "blog/ogp/en/english-slug.png",
      Buffer.from("blog"),
      expect.any(String),
    );
    expect(log).toHaveBeenCalledWith("[upload] blog/ogp/en/english-slug.png");
  });

  test("generates Japanese blog OGP without the en prefix", async () => {
    const deps = createDeps();

    await generateOgp(parseGenerateInput({ file: repoRelativeJapanesePath }, []), deps);

    expect(deps.checkImageExists).toHaveBeenCalledWith(
      "blog/ogp/japanese-slug.png",
      expect.any(String),
    );
    expect(deps.generateBlogOgpImage).toHaveBeenCalledWith("Japanese Title", [
      "typescript",
      "svelte",
    ]);
  });

  test("skips upload when the blog image already exists", async () => {
    const deps = createDeps({
      checkImageExists: vi.fn().mockResolvedValue(true),
    });
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    await generateOgp(
      {
        slug: "existing-blog",
        tags: ["react"],
        title: "Existing Blog",
      },
      deps,
    );

    expect(deps.generateBlogOgpImage).not.toHaveBeenCalled();
    expect(deps.uploadImage).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith("[skip] blog/ogp/existing-blog.png");
  });

  test("generates a short OGP with direct arguments", async () => {
    const deps = createDeps();
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    await generateOgp(
      {
        shortId: "short-123",
        tags: [],
        title: "Short Title",
      },
      deps,
    );

    expect(deps.checkImageExists).toHaveBeenCalledWith(
      "blog/shorts/ogp/short-123.png",
      expect.any(String),
    );
    expect(deps.generateShortOgpImage).toHaveBeenCalledWith("Short Title");
    expect(deps.uploadImage).toHaveBeenCalledWith(
      "blog/shorts/ogp/short-123.png",
      Buffer.from("short"),
      expect.any(String),
    );
    expect(log).toHaveBeenCalledWith("[upload] blog/shorts/ogp/short-123.png");
  });

  test("skips upload when the short image already exists", async () => {
    const deps = createDeps({
      checkImageExists: vi.fn().mockResolvedValue(true),
    });
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    await generateOgp(
      {
        shortId: "short-123",
        tags: [],
        title: "Short Title",
      },
      deps,
    );

    expect(deps.generateShortOgpImage).not.toHaveBeenCalled();
    expect(deps.uploadImage).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith("[skip] blog/shorts/ogp/short-123.png");
  });
});
