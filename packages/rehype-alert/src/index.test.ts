import { describe, test, expect } from "vitest";
import { unified } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";

import rehypeAlert from ".";

const processor = unified()
  .use(markdown)
  .use(remark2rehype, {
    allowDangerousHtml: true,
  })
  .use(rehypeAlert)
  .use(html, { allowDangerousHtml: true });

describe("rehype-alert", () => {
  test("x> で始まる行を警告に変換する", async () => {
    const { value } = await processor.process(`x> This is a error`);
    expect(value).toMatchSnapshot();
  });

  test("!> で始まる行を Note に変換する", async () => {
    const { value } = await processor.process(`!> This is a info`);
    expect(value).toMatchSnapshot();
  });

  test("-> で始まる行を Tip に変換する", async () => {
    const { value } = await processor.process(`-> This is a success`);
    expect(value).toMatchSnapshot();
  });

  test("?> で始まる行を warning に変換する", async () => {
    const { value } = await processor.process(`?> This is a warning`);
    expect(value).toMatchSnapshot();
  });

  test("b> で始まる行を baseline-status に変換する", async () => {
    const { value } = await processor.process(`b> 12345`);
    expect(value).toMatchSnapshot();
  });
});
