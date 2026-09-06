import { visit } from "unist-util-visit";
import type { Plugin } from "unified";

/**
 * Decodes HTML entities that might have been encoded by the markdown processor
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#x26;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Validates if a URL is safe for use in video elements
 * Only allows http and https protocols to prevent XSS attacks
 */
function isValidVideoUrl(url: string): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  // Trim whitespace
  url = url.trim();

  // Reject empty URLs
  if (!url) {
    return false;
  }

  // Decode any HTML entities that might have been encoded by markdown processors
  url = decodeHtmlEntities(url);

  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    // If URL parsing fails, it's not a valid URL
    return false;
  }
}

/**
 * Escapes HTML characters that could break the HTML attribute
 * Note: We don't escape & in URLs as browsers expect literal & in src attributes
 */
function escapeHtmlAttribute(unsafe: string): string {
  return unsafe
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * `!v(url)` または `!v(url 1280x720)` にマッチする。
 * 寸法は省略可能だが、指定するとレイアウトシフトを防げるため
 * アップロード CLI は常に付与する。
 */
const videoPattern = /!v\(([^\s)]+)(?:\s+(\d+)x(\d+))?\)/g;

/**
 * 自動再生はしない。GIF を避ける理由が「読者が停止できない」ことなので、
 * 自動再生を入れると同じ問題を再生産してしまう。
 *
 * - preload="metadata": 本体を先読みせず、先頭フレームだけ見せる
 * - playsinline: iPhone で再生時にフルスクリーンへ乗っ取られるのを防ぐ
 */
function buildVideoTag(
  rawUrl: string,
  width?: string,
  height?: string,
): string | null {
  if (!isValidVideoUrl(rawUrl)) {
    return null;
  }

  const escapedUrl = escapeHtmlAttribute(decodeHtmlEntities(rawUrl));
  const size = width && height ? ` width="${width}" height="${height}"` : "";

  return `<video src="${escapedUrl}"${size} controls preload="metadata" playsinline></video>`;
}

const remarkVideo: Plugin = () => {
  return (tree) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, "text", (node: any) => {
      if (!node.value) return;

      const matches = [...node.value.matchAll(videoPattern)];

      if (matches.length === 0) return;

      // If the text node contains only the video pattern, replace the entire node
      if (matches.length === 1 && node.value.trim() === matches[0][0]) {
        const html = buildVideoTag(matches[0][1], matches[0][2], matches[0][3]);

        // Skip invalid URLs, leave original text
        if (!html) return;

        node.type = "html";
        node.value = html;
        delete node.children;
        return;
      }

      // If there are multiple patterns or mixed content, split the text
      let newValue = node.value;
      for (const match of matches) {
        const html = buildVideoTag(match[1], match[2], match[3]);

        // Skip invalid URLs, leave original pattern
        if (!html) continue;

        newValue = newValue.replace(match[0], html);
      }

      if (newValue !== node.value) {
        node.type = "html";
        node.value = newValue;
        delete node.children;
      }
    });
  };
};

export default remarkVideo;
