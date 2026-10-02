import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  writeFile,
  access,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const mocks = vi.hoisted(() => ({
  uploadAsset: vi.fn(),
  transcodeVideo: vi.fn(),
  probeVideoSize: vi.fn(),
  convertImageToPng: vi.fn(),
}));

vi.mock("./api.ts", () => ({ uploadAsset: mocks.uploadAsset }));
vi.mock("./video.ts", () => ({
  transcodeVideo: mocks.transcodeVideo,
  probeVideoSize: mocks.probeVideoSize,
}));
vi.mock("./image.ts", () => ({ convertImageToPng: mocks.convertImageToPng }));

const { uploadMedia } = await import("./uploadMedia.ts");

const frontMatter = (title: string) => `---
id: testId
title: "${title}"
slug: "example-slug"
about: "概要"
createdAt: "2026-09-05T16:00+09:00"
updatedAt: "2026-09-05T16:00+09:00"
tags: ["Test"]
thumbnail:
  url: "https://images.ctfassets.net/a/b/c/thumb.png"
  title: "サムネイル"
audio: null
published: false
---
`;

let blogPostDir: string;
let repositoryRoot: string;
const logs: string[] = [];
const log = (message: string) => logs.push(message);

const writeJa = (body: string) =>
  writeFile(
    join(blogPostDir, "testId.md"),
    frontMatter("記事") + body,
    "utf-8",
  );
const writeEn = (body: string) =>
  writeFile(
    join(blogPostDir, "en", "testId.md"),
    frontMatter("Post") + body,
    "utf-8",
  );
const readJa = () => readFile(join(blogPostDir, "testId.md"), "utf-8");
const readEn = () => readFile(join(blogPostDir, "en", "testId.md"), "utf-8");

const exists = (filePath: string) =>
  access(filePath).then(
    () => true,
    () => false,
  );

beforeEach(async () => {
  vi.clearAllMocks();
  logs.length = 0;
  repositoryRoot = await mkdtemp(join(tmpdir(), "upload-media-spec-"));
  blogPostDir = join(repositoryRoot, "contents/blogPost");
  await mkdir(join(blogPostDir, "en"), { recursive: true });
  mocks.uploadAsset.mockImplementation(async ({ fileName }) => ({
    url: `https://images.ctfassets.net/space/asset/token/${fileName}`,
    assetId: "assetId",
  }));
  mocks.probeVideoSize.mockResolvedValue({ width: 1280, height: 720 });
  mocks.transcodeVideo.mockImplementation(async (_input, output) => {
    await writeFile(output, "transcoded", "utf-8");
  });
  mocks.convertImageToPng.mockImplementation(async (_input, output) => {
    await writeFile(output, "converted", "utf-8");
  });
});

afterEach(async () => {
  await rm(repositoryRoot, { recursive: true, force: true });
});

describe("uploadMedia", () => {
  test("画像をアップロードして URL に置き換え、ローカルファイルを消す", async () => {
    await writeJa("![説明](image.png)");
    await writeFile(join(blogPostDir, "image.png"), "png", "utf-8");

    await uploadMedia({ blogPostDir, id: "testId", log });

    expect(await readJa()).toContain(
      "![説明](https://images.ctfassets.net/space/asset/token/example-slug-1.png)",
    );
    expect(await exists(join(blogPostDir, "image.png"))).toBe(false);
  });

  test("日英から参照された同じ画像は 1 度だけアップロードして両方置き換える", async () => {
    await writeJa("![図](image.png)\n\nもう一度 ![図](image.png)");
    await writeEn("![Diagram](image.png)");
    await writeFile(join(blogPostDir, "image.png"), "png", "utf-8");

    await uploadMedia({ blogPostDir, id: "testId", log });

    expect(mocks.uploadAsset).toHaveBeenCalledTimes(1);

    const url =
      "https://images.ctfassets.net/space/asset/token/example-slug-1.png";
    expect((await readJa()).match(new RegExp(url, "g"))).toHaveLength(2);
    expect(await readEn()).toContain(`![Diagram](${url})`);
  });

  test("動画は mp4 に変換し、寸法付きの記法に置き換える", async () => {
    await writeJa("!v(recording.mov)");
    await writeFile(join(blogPostDir, "recording.mov"), "mov", "utf-8");

    await uploadMedia({ blogPostDir, id: "testId", log });

    expect(mocks.transcodeVideo).toHaveBeenCalledTimes(1);
    expect(await readJa()).toContain(
      "!v(https://images.ctfassets.net/space/asset/token/example-slug-1.mp4 1280x720)",
    );
    expect(await exists(join(blogPostDir, "recording.mov"))).toBe(false);
  });

  test("tiff は png に変換してからアップロードする", async () => {
    await writeJa("![図](image.tiff)");
    await writeFile(join(blogPostDir, "image.tiff"), "tiff", "utf-8");

    await uploadMedia({ blogPostDir, id: "testId", log });

    expect(mocks.convertImageToPng).toHaveBeenCalledTimes(1);
    expect(mocks.uploadAsset).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: "example-slug-1.png",
        contentType: "image/png",
      }),
    );
    expect(await readJa()).toContain(
      "![図](https://images.ctfassets.net/space/asset/token/example-slug-1.png)",
    );
    expect(await exists(join(blogPostDir, "image.tiff"))).toBe(false);
  });

  test("対応していない形式があれば 1 件もアップロードしない", async () => {
    await writeJa("![](image.png)\n\n![](diagram.svg)");
    await writeFile(join(blogPostDir, "image.png"), "png", "utf-8");
    await writeFile(join(blogPostDir, "diagram.svg"), "svg", "utf-8");

    await expect(
      uploadMedia({ blogPostDir, id: "testId", log }),
    ).rejects.toThrow("対応していない形式");

    expect(mocks.uploadAsset).not.toHaveBeenCalled();
  });

  test("既に使われている連番の次から振る", async () => {
    await writeJa(
      "![](https://images.ctfassets.net/a/b/c/example-slug-3.png)\n\n![](image.png)",
    );
    await writeFile(join(blogPostDir, "image.png"), "png", "utf-8");

    await uploadMedia({ blogPostDir, id: "testId", log });

    expect(mocks.uploadAsset).toHaveBeenCalledWith(
      expect.objectContaining({ fileName: "example-slug-4.png" }),
    );
  });

  test("アップロード済みだけの記事では何もしない", async () => {
    await writeJa("![](https://images.ctfassets.net/a/b/c/example-slug-1.png)");

    await uploadMedia({ blogPostDir, id: "testId", log });

    expect(mocks.uploadAsset).not.toHaveBeenCalled();
  });

  test("参照先が無いときは 1 件もアップロードせずに失敗する", async () => {
    await writeJa("![](image.png)\n\n![](missing.png)");
    await writeFile(join(blogPostDir, "image.png"), "png", "utf-8");

    await expect(
      uploadMedia({ blogPostDir, id: "testId", log }),
    ).rejects.toThrow("missing.png");

    expect(mocks.uploadAsset).not.toHaveBeenCalled();
    expect(await exists(join(blogPostDir, "image.png"))).toBe(true);
  });

  test("dry-run ではアップロードも削除も書き換えもしない", async () => {
    await writeJa("![](image.png)");
    await writeFile(join(blogPostDir, "image.png"), "png", "utf-8");

    await uploadMedia({ blogPostDir, id: "testId", dryRun: true, log });

    expect(mocks.uploadAsset).not.toHaveBeenCalled();
    expect(await readJa()).toContain("![](image.png)");
    expect(await exists(join(blogPostDir, "image.png"))).toBe(true);
    expect(logs.join("\n")).toContain("example-slug-1.png");
  });

  test("記事が無ければ失敗する", async () => {
    await expect(
      uploadMedia({ blogPostDir, id: "unknown", log }),
    ).rejects.toThrow("記事が見つかりません");
  });

  test("英語側だけに残ったローカル参照も処理する", async () => {
    await writeJa("![](https://images.ctfassets.net/a/b/c/example-slug-1.png)");
    await writeEn("![Diagram](later.png)");
    await writeFile(join(blogPostDir, "en", "later.png"), "png", "utf-8");

    await uploadMedia({ blogPostDir, id: "testId", log });

    expect(await readEn()).toContain(
      "![Diagram](https://images.ctfassets.net/space/asset/token/example-slug-2.png)",
    );
    expect(await exists(join(blogPostDir, "en", "later.png"))).toBe(false);
  });
});

describe("画像の配置と参照パス", () => {
  test.each([
    ["記事からの相対パス", "../../assets/image.png"],
    ["リポジトリ基準のパス", "assets/image.png"],
    ["絶対パス", "absolute"],
    ["file URL", "file-url"],
    ["空白を含むパス", "space"],
  ])(
    "%s で参照した画像をアップロードし、元画像は保持する",
    async (_label, path) => {
      const sourcePath = join(
        repositoryRoot,
        "assets",
        path === "space" ? "my image.png" : "image.png",
      );
      await mkdir(join(repositoryRoot, "assets"));
      await writeFile(sourcePath, "image");
      const reference =
        path === "absolute"
          ? sourcePath
          : path === "file-url"
            ? pathToFileURL(sourcePath).href
            : path === "space"
              ? "<../../assets/my image.png>"
              : path;
      await writeJa(`![図](${reference})`);

      await uploadMedia({ blogPostDir, id: "testId", log });

      expect(mocks.uploadAsset).toHaveBeenCalledTimes(1);
      expect(await readJa()).toContain(
        "![図](https://images.ctfassets.net/space/asset/token/example-slug-1.png)",
      );
      expect(await exists(sourcePath)).toBe(true);
    },
  );

  test("/images の URL を app/static から解決し、別名での同じ参照も一度だけアップロードする", async () => {
    const sourcePath = join(repositoryRoot, "app/static/images/demo/image.png");
    await mkdir(join(repositoryRoot, "app/static/images/demo"), {
      recursive: true,
    });
    await writeFile(sourcePath, "image");
    await writeJa("![図](/images/demo/image.png)");
    await writeEn("![Diagram](../../../app/static/images/demo/image.png)");

    await uploadMedia({ blogPostDir, id: "testId", log });

    expect(mocks.uploadAsset).toHaveBeenCalledTimes(1);
    expect(await readJa()).toContain(
      "![図](https://images.ctfassets.net/space/asset/token/example-slug-1.png)",
    );
    expect(await readEn()).toContain(
      "![Diagram](https://images.ctfassets.net/space/asset/token/example-slug-1.png)",
    );
    expect(await exists(sourcePath)).toBe(true);
  });

  test("同名でも別ディレクトリにある画像を混同しない", async () => {
    await mkdir(join(blogPostDir, "a"));
    await mkdir(join(blogPostDir, "b"));
    await writeFile(join(blogPostDir, "a/image.png"), "first");
    await writeFile(join(blogPostDir, "b/image.png"), "second");
    await writeJa("![A](a/image.png)\n![B](b/image.png)");
    await writeEn("![B](../b/image.png)");

    await uploadMedia({ blogPostDir, id: "testId", log });

    expect(mocks.uploadAsset).toHaveBeenCalledTimes(2);
    expect(await readJa()).toContain(
      "![A](https://images.ctfassets.net/space/asset/token/example-slug-1.png)",
    );
    expect(await readJa()).toContain(
      "![B](https://images.ctfassets.net/space/asset/token/example-slug-2.png)",
    );
    expect(await readEn()).toContain(
      "![B](https://images.ctfassets.net/space/asset/token/example-slug-2.png)",
    );
  });

  test("日英に同名の別画像がある場合は各記事のディレクトリを優先する", async () => {
    await writeJa("![日本語](image.png)");
    await writeEn("![English](image.png)");
    await writeFile(join(blogPostDir, "image.png"), "ja");
    await writeFile(join(blogPostDir, "en/image.png"), "en");

    await uploadMedia({ blogPostDir, id: "testId", log });

    expect(mocks.uploadAsset).toHaveBeenCalledTimes(2);
    expect(await readJa()).toContain("example-slug-1.png");
    expect(await readEn()).toContain("example-slug-2.png");
  });

  test("明示されたパスがなければ同名の別ファイルに置き換えない", async () => {
    await writeJa("![](missing/image.png)");
    await writeFile(join(blogPostDir, "image.png"), "wrong");

    await expect(
      uploadMedia({ blogPostDir, id: "testId", log }),
    ).rejects.toThrow("missing/image.png");
    expect(mocks.uploadAsset).not.toHaveBeenCalled();
    expect(await exists(join(blogPostDir, "image.png"))).toBe(true);
  });
});
