import { describe, test, expect } from "vitest";
import { unified } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";

import remarkContentfulImage from ".";

const processor = unified()
  .use(markdown)
  .use(remarkContentfulImage)
  .use(remark2rehype, {
    allowDangerousHtml: true,
  })
  .use(html, { allowDangerousHtml: true });

describe("remark-contentful-image", () => {
  test("contentful のドメインの画像なら、srcset を追加する", async () => {
    const { value } = await processor.process(
      `![test](https://images.ctfassets.net/123/456/789.jpg)`,
    );
    console.log(value.toString());
    expect(value.toString()).toBe(
      `<p><img src="https://images.ctfassets.net/123/456/789.jpg?q=50&fm=webp" alt="test" loading="lazy" srcset="https://images.ctfassets.net/123/456/789.jpg?q=50&fm=webp&w=100 100w,https://images.ctfassets.net/123/456/789.jpg?q=50&fm=webp&w=200 200w,https://images.ctfassets.net/123/456/789.jpg?q=50&fm=webp&w=300 300w,https://images.ctfassets.net/123/456/789.jpg?q=50&fm=webp&w=400 400w,https://images.ctfassets.net/123/456/789.jpg?q=50&fm=webp&w=500 500w,https://images.ctfassets.net/123/456/789.jpg?q=50&fm=webp&w=600 600w,https://images.ctfassets.net/123/456/789.jpg?q=50&fm=webp&w=700 700w,https://images.ctfassets.net/123/456/789.jpg?q=50&fm=webp&w=800 800w,https://images.ctfassets.net/123/456/789.jpg?q=50&fm=webp&w=900 900w,https://images.ctfassets.net/123/456/789.jpg?q=50&fm=webp&w=1000 1000w,https://images.ctfassets.net/123/456/789.jpg?q=50&fm=webp&w=1100 1100w,https://images.ctfassets.net/123/456/789.jpg?q=50&fm=webp&w=1200 1200w" sizes="(max-width: 1024px) 100vw, 1024px" /></p>`,
    );
  });

  test("contentful のドメインの画像でないなら、srcset を追加しない", async () => {
    const { value } = await processor.process(
      `![test](https://example.com/123/456/789.jpg)`,
    );
    console.log(value.toString());
    expect(value.toString()).toBe(
      `<p><img src="https://example.com/123/456/789.jpg" alt="test" loading="lazy" /></p>`,
    );
  });
});
