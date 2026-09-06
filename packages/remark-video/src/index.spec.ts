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
      `<p><video src="https://example.com/video.mp4" controls preload="metadata" playsinline></video></p>`,
    );
  });

  test("handles multiple video patterns in same text", async () => {
    const { value } = await processor.process(
      `Here is a video: !v(https://example.com/video1.mp4) and another: !v(https://example.com/video2.mp4)`,
    );
    expect(value.toString()).toBe(
      `<p>Here is a video: <video src="https://example.com/video1.mp4" controls preload="metadata" playsinline></video> and another: <video src="https://example.com/video2.mp4" controls preload="metadata" playsinline></video></p>`,
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
      `<p><video src="https://example.com/video.mp4?t=30&autoplay=1" controls preload="metadata" playsinline></video></p>`,
    );
  });

  test("handles video pattern in paragraph with other content", async () => {
    const { value } = await processor.process(
      `Check out this video: !v(https://example.com/video.mp4) - it's great!`,
    );
    expect(value.toString()).toBe(
      `<p>Check out this video: <video src="https://example.com/video.mp4" controls preload="metadata" playsinline></video> - it's great!</p>`,
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

  // Security tests
  test("blocks javascript protocol URLs", async () => {
    const { value } = await processor.process(`!v(javascript:alert('xss'))`);
    expect(value.toString()).toBe(`<p>!v(javascript:alert('xss'))</p>`);
  });

  test("blocks data protocol URLs", async () => {
    const { value } = await processor.process(
      `!v(data:text/html,<script>alert('xss')</script>)`,
    );
    expect(value.toString()).toBe(
      `<p>!v(data:text/html,<script>alert('xss')</script>)</p>`,
    );
  });

  test("blocks file protocol URLs", async () => {
    const { value } = await processor.process(`!v(file:///etc/passwd)`);
    expect(value.toString()).toBe(`<p>!v(file:///etc/passwd)</p>`);
  });

  test("blocks ftp protocol URLs", async () => {
    const { value } = await processor.process(`!v(ftp://example.com/file.mp4)`);
    expect(value.toString()).toBe(`<p>!v(ftp://example.com/file.mp4)</p>`);
  });

  test("allows http URLs", async () => {
    const { value } = await processor.process(
      `!v(http://example.com/video.mp4)`,
    );
    expect(value.toString()).toBe(
      `<p><video src="http://example.com/video.mp4" controls preload="metadata" playsinline></video></p>`,
    );
  });

  test("allows https URLs", async () => {
    const { value } = await processor.process(
      `!v(https://example.com/video.mp4)`,
    );
    expect(value.toString()).toBe(
      `<p><video src="https://example.com/video.mp4" controls preload="metadata" playsinline></video></p>`,
    );
  });

  test("handles mixed valid and invalid URLs", async () => {
    const { value } = await processor.process(
      `Valid: !v(https://example.com/video.mp4) Invalid: !v(javascript:alert('xss'))`,
    );
    expect(value.toString()).toBe(
      `<p>Valid: <video src="https://example.com/video.mp4" controls preload="metadata" playsinline></video> Invalid: !v(javascript:alert('xss'))</p>`,
    );
  });

  test("blocks URLs with only whitespace", async () => {
    const { value } = await processor.process(`!v(   )`);
    expect(value.toString()).toBe(`<p>!v(   )</p>`);
  });

  test("blocks malformed URLs", async () => {
    const { value } = await processor.process(`!v(not-a-valid-url)`);
    expect(value.toString()).toBe(`<p>!v(not-a-valid-url)</p>`);
  });

  test("adds width and height when dimensions are given", async () => {
    const { value } = await processor.process(
      `!v(https://example.com/video.mp4 1280x720)`,
    );
    expect(value.toString()).toBe(
      `<p><video src="https://example.com/video.mp4" width="1280" height="720" controls preload="metadata" playsinline></video></p>`,
    );
  });

  test("handles dimensions in a paragraph with other content", async () => {
    const { value } = await processor.process(
      `Before: !v(https://example.com/video.mp4 640x480) after.`,
    );
    expect(value.toString()).toBe(
      `<p>Before: <video src="https://example.com/video.mp4" width="640" height="480" controls preload="metadata" playsinline></video> after.</p>`,
    );
  });

  test("leaves the pattern untouched when dimensions are malformed", async () => {
    const { value } = await processor.process(
      `!v(https://example.com/video.mp4 1280x)`,
    );
    expect(value.toString()).toBe(
      `<p>!v(https://example.com/video.mp4 1280x)</p>`,
    );
  });
});
