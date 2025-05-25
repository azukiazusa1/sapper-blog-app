import { describe, expect, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import remarkVideo from "./index";

describe("remark-video", () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkVideo)
    .use(remarkHtml);

  it("should convert !v(url) syntax to video tag", async () => {
    const input = "Check out this video: !v(https://example.com/video.mp4)";
    const result = await processor.process(input);
    
    expect(result.toString()).toContain('<video src="https://example.com/video.mp4" controls></video>');
  });

  it("should handle multiple video tags in the same text", async () => {
    const input = "Video 1: !v(https://example.com/video1.mp4) and Video 2: !v(https://example.com/video2.mp4)";
    const result = await processor.process(input);
    const output = result.toString();
    
    expect(output).toContain('<video src="https://example.com/video1.mp4" controls></video>');
    expect(output).toContain('<video src="https://example.com/video2.mp4" controls></video>');
  });

  it("should not affect text without video syntax", async () => {
    const input = "This is just regular text without any video tags.";
    const result = await processor.process(input);
    
    expect(result.toString()).not.toContain('<video');
    expect(result.toString()).toContain('This is just regular text');
  });

  it("should handle video syntax in a paragraph", async () => {
    const input = "Here's a video:\n\n!v(https://example.com/demo.mp4)\n\nAnd some more text.";
    const result = await processor.process(input);
    
    expect(result.toString()).toContain('<video src="https://example.com/demo.mp4" controls></video>');
  });

  it("should handle URLs with query parameters", async () => {
    const input = "!v(https://example.com/video.mp4?t=30&autoplay=1)";
    const result = await processor.process(input);
    
    expect(result.toString()).toContain('<video src="https://example.com/video.mp4?t=30&autoplay=1" controls></video>');
  });
});