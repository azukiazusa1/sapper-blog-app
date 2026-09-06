import { describe, test, expect } from "vitest";
import {
  findLocalMedia,
  nextSequence,
  assetFileName,
  replaceReference,
  contentTypeOf,
  needsImageConversion,
  isSupported,
} from "./media.ts";

const imageRef = (filePath: string) => ({
  kind: "image" as const,
  raw: "",
  filePath,
  alt: "",
});

const videoRef = (filePath: string) => ({
  kind: "video" as const,
  raw: "",
  filePath,
  alt: "",
});

describe("findLocalMedia", () => {
  test("ローカルの画像参照を alt ごと取り出す", () => {
    const references = findLocalMedia("![説明](image_1.png)");
    expect(references).toEqual([
      {
        kind: "image",
        raw: "![説明](image_1.png)",
        filePath: "image_1.png",
        alt: "説明",
      },
    ]);
  });

  test("alt が空でも取り出す", () => {
    expect(findLocalMedia("![](image.png)")[0]?.alt).toBe("");
  });

  test("アップロード済みの URL は無視する", () => {
    expect(
      findLocalMedia(
        "![](https://images.ctfassets.net/a/b/c/d.png)\n![](//images.ctfassets.net/a/b/c/e.png)",
      ),
    ).toEqual([]);
  });

  test("ローカルの動画参照を取り出す", () => {
    const references = findLocalMedia("!v(recording.mov)");
    expect(references[0]).toMatchObject({
      kind: "video",
      raw: "!v(recording.mov)",
      filePath: "recording.mov",
    });
  });

  test("寸法付きのアップロード済み動画は無視する", () => {
    expect(
      findLocalMedia(
        "!v(https://downloads.ctfassets.net/a/b/c/d.mp4 1280x720)",
      ),
    ).toEqual([]);
  });

  test("画像と動画が混在していても両方取り出す", () => {
    const references = findLocalMedia("![](a.png)\n\n!v(b.mov)");
    expect(references.map((r) => r.kind)).toEqual(["image", "video"]);
  });

  test("通常のリンクは画像として拾わない", () => {
    expect(findLocalMedia("[リンク](./page.md)")).toEqual([]);
  });
});

describe("nextSequence", () => {
  test("使われていなければ 1 から始める", () => {
    expect(nextSequence(["![](image.png)"], "example-slug")).toBe(1);
  });

  test("既存の最大値の次を返す", () => {
    const ja = "![](https://images.ctfassets.net/a/b/c/example-slug-1.png)";
    const en = "![](https://images.ctfassets.net/a/b/c/example-slug-3.png)";
    expect(nextSequence([ja, en], "example-slug")).toBe(4);
  });

  test("動画の連番も同じ空間で数える", () => {
    const article =
      "!v(https://downloads.ctfassets.net/a/b/c/s-2.mp4 1280x720)";
    expect(nextSequence([article], "s")).toBe(3);
  });
});

describe("assetFileName", () => {
  test("画像は元の拡張子を保つ", () => {
    expect(
      assetFileName("example-slug", 2, {
        kind: "image",
        raw: "",
        filePath: "image_1.PNG",
        alt: "",
      }),
    ).toBe("example-slug-2.png");
  });

  test("tiff は png になる", () => {
    expect(assetFileName("example-slug", 1, imageRef("image.tiff"))).toBe(
      "example-slug-1.png",
    );
  });

  test("動画は常に mp4 になる", () => {
    expect(
      assetFileName("example-slug", 1, {
        kind: "video",
        raw: "",
        filePath: "recording.mov",
        alt: "",
      }),
    ).toBe("example-slug-1.mp4");
  });
});

describe("needsImageConversion", () => {
  test("macOS のクリップボード由来の tiff は変換する", () => {
    expect(needsImageConversion(imageRef("image.tiff"))).toBe(true);
    expect(needsImageConversion(imageRef("image.TIF"))).toBe(true);
  });

  test("そのまま上げられる形式は変換しない", () => {
    expect(needsImageConversion(imageRef("image.png"))).toBe(false);
    expect(needsImageConversion(imageRef("image.gif"))).toBe(false);
  });
});

describe("isSupported", () => {
  test("画像は変換ありなしのどちらも通す", () => {
    expect(isSupported(imageRef("a.png"))).toBe(true);
    expect(isSupported(imageRef("a.webp"))).toBe(true);
    expect(isSupported(imageRef("a.tiff"))).toBe(true);
  });

  test("動画は mov と mp4 だけ通す", () => {
    expect(isSupported(videoRef("a.mov"))).toBe(true);
    expect(isSupported(videoRef("a.mp4"))).toBe(true);
    expect(isSupported(videoRef("a.avi"))).toBe(false);
  });

  test("対応していない形式は弾く", () => {
    expect(isSupported(imageRef("a.svg"))).toBe(false);
    expect(isSupported(imageRef("a.pdf"))).toBe(false);
  });
});

describe("replaceReference", () => {
  const url = "https://images.ctfassets.net/a/b/c/example-slug-1.png";

  test("画像は alt を保ったまま URL に置き換える", () => {
    const reference = {
      kind: "image" as const,
      raw: "![説明](image_1.png)",
      filePath: "image_1.png",
      alt: "説明",
    };
    expect(
      replaceReference("前\n![説明](image_1.png)\n後", reference, url),
    ).toBe(`前\n![説明](${url})\n後`);
  });

  test("同じ参照が複数あればすべて置き換える", () => {
    const reference = {
      kind: "image" as const,
      raw: "![](a.png)",
      filePath: "a.png",
      alt: "",
    };
    expect(replaceReference("![](a.png) と ![](a.png)", reference, url)).toBe(
      `![](${url}) と ![](${url})`,
    );
  });

  test("alt が違っても同じファイルなら置き換える", () => {
    const reference = {
      kind: "image" as const,
      raw: "![図](image.png)",
      filePath: "image.png",
      alt: "図",
    };
    expect(replaceReference("![Diagram](image.png)", reference, url)).toBe(
      `![Diagram](${url})`,
    );
  });

  test("別のファイルは置き換えない", () => {
    const reference = {
      kind: "image" as const,
      raw: "![](a.png)",
      filePath: "a.png",
      alt: "",
    };
    expect(replaceReference("![](b.png)", reference, url)).toBe("![](b.png)");
  });

  test("動画は寸法付きで置き換える", () => {
    const reference = {
      kind: "video" as const,
      raw: "!v(recording.mov)",
      filePath: "recording.mov",
      alt: "",
    };
    const videoUrl = "https://downloads.ctfassets.net/a/b/c/example-slug-1.mp4";
    expect(
      replaceReference("!v(recording.mov)", reference, videoUrl, {
        width: 1280,
        height: 720,
      }),
    ).toBe(`!v(${videoUrl} 1280x720)`);
  });
});

describe("contentTypeOf", () => {
  test("拡張子から Content-Type を返す", () => {
    expect(contentTypeOf("a.png")).toBe("image/png");
    expect(contentTypeOf("a.JPG")).toBe("image/jpeg");
    expect(contentTypeOf("a.mp4")).toBe("video/mp4");
  });

  test("対応していない拡張子は例外にする", () => {
    expect(() => contentTypeOf("a.mov")).toThrowError();
  });
});
