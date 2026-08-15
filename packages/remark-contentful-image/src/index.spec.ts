import { describe, expect, test } from "vitest";
import { unified } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";

import remarkContentfulImage from ".";

const processor = unified()
  .use(markdown)
  .use(remarkContentfulImage)
  .use(remark2rehype)
  .use(html);

describe("remark-contentful-image", () => {
  test("Contentful の画像をレスポンシブ画像に変換する", async () => {
    const { value } = await processor.process(
      `![test](https://images.ctfassets.net/123/456/789.jpg)`,
    );

    expect(value.toString()).toContain(
      'src="https://images.ctfassets.net/123/456/789.jpg?fm=webp&#x26;q=60&#x26;w=1024"',
    );
    expect(value.toString()).toContain('loading="lazy"');
    expect(value.toString()).toContain('decoding="async"');
    expect(value.toString()).toContain(
      'sizes="auto, (max-width: 1024px) 100vw, 1024px"',
    );
    expect(value.toString()).toContain(
      "789.jpg?fm=webp&#x26;q=60&#x26;w=320 320w",
    );
    expect(value.toString()).toContain(
      "789.jpg?fm=webp&#x26;q=60&#x26;w=2048 2048w",
    );
  });

  test("既存のクエリパラメータを保持する", async () => {
    const { value } = await processor.process(
      `![test](https://images.ctfassets.net/123/456/789.jpg?fit=fill&q=80)`,
    );

    expect(value.toString()).toContain(
      "789.jpg?fit=fill&#x26;q=60&#x26;fm=webp&#x26;w=1024",
    );
  });

  test("Contentful 以外の画像は変更しない", async () => {
    const { value } = await processor.process(
      `![test](https://example.com/123/456/789.jpg)`,
    );

    expect(value.toString()).toBe(
      '<p><img src="https://example.com/123/456/789.jpg" alt="test"></p>',
    );
  });

  test("alt 属性を HTML として解釈しない", async () => {
    const { value } = await processor.process(
      `![" onload="alert(1)](https://images.ctfassets.net/123/456/789.jpg)`,
    );

    expect(value.toString()).not.toContain('onload="alert(1)"');
    expect(value.toString()).toContain("&#x22; onload=&#x22;alert(1)");
  });
});
