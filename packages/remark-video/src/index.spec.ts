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
      `<p>This has <video src="" controls></video> empty pattern and !v incomplete pattern.</p>`,
    );
  });
});