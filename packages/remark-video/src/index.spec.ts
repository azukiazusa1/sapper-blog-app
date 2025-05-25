import { describe, test, expect } from "vitest";
import { unified } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";

import remarkVideo from ".";

const processor = unified()
  .use(markdown)
  .use(remarkVideo)
  .use(remark2rehype, {
    allowDangerousHtml: true,
  })
  .use(html, { allowDangerousHtml: true });

describe("remark-video", () => {
  test("converts !v(url) syntax to video element", async () => {
    const { value } = await processor.process(
      `!v(https://example.com/video.mp4)`,
    );
    expect(value.toString()).toBe(
      `<p><video src="https://example.com/video.mp4" controls></video></p>`,
    );
  });

  test("handles multiple video patterns in same text", async () => {
    const { value } = await processor.process(
      `Here is a video: !v(https://example.com/video1.mp4) and another: !v(https://example.com/video2.mp4)`,
    );
    expect(value.toString()).toBe(
      `<p>Here is a video: <video src="https://example.com/video1.mp4" controls></video> and another: <video src="https://example.com/video2.mp4" controls></video></p>`,
    );
  });

  test("ignores text without video pattern", async () => {
    const { value } = await processor.process(
      `This is just regular text with no video.`,
    );
    expect(value.toString()).toBe(
      `<p>This is just regular text with no video.</p>`,
    );
  });

  test("handles video pattern with query parameters", async () => {
    const { value } = await processor.process(
      `!v(https://example.com/video.mp4?t=30&autoplay=1)`,
    );
    expect(value.toString()).toBe(
      `<p><video src="https://example.com/video.mp4?t=30&autoplay=1" controls></video></p>`,
    );
  });

  test("handles video pattern in paragraph with other content", async () => {
    const { value } = await processor.process(
      `Check out this video: !v(https://example.com/video.mp4) - it's great!`,
    );
    expect(value.toString()).toBe(
      `<p>Check out this video: <video src="https://example.com/video.mp4" controls></video> - it's great!</p>`,
    );
  });

  test("handles empty or invalid patterns gracefully", async () => {
    const { value } = await processor.process(
      `This has !v() empty pattern and !v incomplete pattern.`,
    );
    expect(value.toString()).toBe(
      `<p>This has !v() empty pattern and !v incomplete pattern.</p>`,
    );
  });

  describe("Security tests", () => {
    test("blocks javascript: URLs", async () => {
      const { value } = await processor.process(
        `!v(javascript:alert('xss'))`,
      );
      expect(value.toString()).toBe(
        `<p>!v(javascript:alert('xss'))</p>`,
      );
    });

    test("blocks data: URLs", async () => {
      const { value } = await processor.process(
        `!v(data:text/html,<script>alert('xss')</script>)`,
      );
      expect(value.toString()).toBe(
        `<p>!v(data:text/html,<script>alert('xss')</script>)</p>`,
      );
    });

    test("blocks vbscript: URLs", async () => {
      const { value } = await processor.process(
        `!v(vbscript:MsgBox("XSS"))`,
      );
      expect(value.toString()).toBe(
        `<p>!v(vbscript:MsgBox("XSS"))</p>`,
      );
    });

    test("blocks file: URLs", async () => {
      const { value } = await processor.process(
        `!v(file:///etc/passwd)`,
      );
      expect(value.toString()).toBe(
        `<p>!v(file:///etc/passwd)</p>`,
      );
    });

    test("escapes HTML characters in valid URLs", async () => {
      const { value } = await processor.process(
        `!v(https://example.com/video.mp4?title=<script>alert('xss')</script>&param="test")`,
      );
      expect(value.toString()).toBe(
        `<p><video src="https://example.com/video.mp4?title=%3Cscript%3Ealert('xss')%3C/script%3E&amp;param=%22test%22" controls></video></p>`,
      );
    });

    test("handles URLs with mixed malicious and valid content", async () => {
      const { value } = await processor.process(
        `Here is a good video: !v(https://example.com/video.mp4) and bad: !v(javascript:alert('xss'))`,
      );
      expect(value.toString()).toBe(
        `<p>Here is a good video: <video src="https://example.com/video.mp4" controls></video> and bad: !v(javascript:alert('xss'))</p>`,
      );
    });

    test("blocks empty or whitespace-only URLs", async () => {
      const { value } = await processor.process(
        `!v(   ) and !v(\t\n)`,
      );
      expect(value.toString()).toBe(
        `<p>!v(   ) and !v(\t\n)</p>`,
      );
    });

    test("blocks invalid URLs", async () => {
      const { value } = await processor.process(
        `!v(not-a-valid-url) and !v(://invalid)`,
      );
      expect(value.toString()).toBe(
        `<p>!v(not-a-valid-url) and !v(://invalid)</p>`,
      );
    });

    test("allows valid http URLs", async () => {
      const { value } = await processor.process(
        `!v(http://example.com/video.mp4)`,
      );
      expect(value.toString()).toBe(
        `<p><video src="http://example.com/video.mp4" controls></video></p>`,
      );
    });

    test("allows valid https URLs", async () => {
      const { value } = await processor.process(
        `!v(https://example.com/video.mp4)`,
      );
      expect(value.toString()).toBe(
        `<p><video src="https://example.com/video.mp4" controls></video></p>`,
      );
    });
  });
});
