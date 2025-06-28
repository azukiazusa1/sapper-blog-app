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
  describe("legacy syntax", () => {
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

  describe("new syntax", () => {
    test(":::note を Note に変換する", async () => {
      const { value } = await processor.process(`:::note
This is a note
:::`);
      expect(value).toMatchSnapshot();
    });

    test(":::alert を Caution に変換する", async () => {
      const { value } = await processor.process(`:::alert
This is an alert
:::`);
      expect(value).toMatchSnapshot();
    });

    test(":::tip を Tip に変換する", async () => {
      const { value } = await processor.process(`:::tip
This is a tip
:::`);
      expect(value).toMatchSnapshot();
    });

    test(":::warning を Warning に変換する", async () => {
      const { value } = await processor.process(`:::warning
This is a warning
:::`);
      expect(value).toMatchSnapshot();
    });

    test(":::note で複数行のコンテンツを処理する", async () => {
      const { value } = await processor.process(`:::note
This is the first line
This is the second line
:::`);
      expect(value).toMatchSnapshot();
    });

    test(":::tip でMarkdownコンテンツを含む", async () => {
      const { value } = await processor.process(`:::tip
This has **bold** text and *italic* text.
:::`);
      expect(value).toMatchSnapshot();
    });
  });
});
