import { describe, expect, it } from "vitest";
import type { Root } from "hast";
import { unified } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";
import rehypeLinkFavicon from ".";

const process = async (input: string) => {
  const result = await unified()
    .use(markdown)
    .use(remark2rehype)
    .use(rehypeLinkFavicon)
    .use(html)
    .process(input);

  return result.toString();
};

describe("rehypeLinkFavicon", () => {
  it("外部リンクの先頭に favicon を追加する", async () => {
    const result = await process("[Example](https://example.com/path)");

    expect(result).toContain(
      '<a href="https://example.com/path" class="link-with-favicon"><img class="link-favicon" src="https://www.google.com/s2/favicons?domain=example.com&#x26;sz=32" width="16" height="16" alt="" loading="lazy" decoding="async">Example</a>',
    );
  });

  it.each([
    ["ページ内リンク", "[見出し](#heading)"],
    ["相対リンク", "[記事](/posts/example)"],
    ["メールリンク", "[メール](mailto:hello@example.com)"],
  ])("%sには favicon を追加しない", async (_, input) => {
    const result = await process(input);

    expect(result).not.toContain("link-favicon");
  });

  it("文字列の className を持つリンクカードには favicon を追加しない", async () => {
    const tree = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "a",
          properties: {
            className: "link-card",
            href: "https://example.com/",
          },
          children: [{ type: "text", value: "Example" }],
        },
      ],
    };

    const transformedTree = (await unified()
      .use(rehypeLinkFavicon)
      .run(tree)) as Root;
    const result = unified().use(html).stringify(transformedTree);

    expect(result).toBe(
      '<a class="link-card" href="https://example.com/">Example</a>',
    );
    expect(result).not.toContain("link-favicon");
  });
});
