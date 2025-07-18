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

const remarkVideo: Plugin = () => {
  return (tree) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, "text", (node: any) => {
      if (!node.value) return;

      // Match the pattern !v(url)
      const videoPattern = /!v\(([^)]+)\)/g;
      const matches = [...node.value.matchAll(videoPattern)];

      if (matches.length === 0) return;

      // If the text node contains only the video pattern, replace the entire node
      if (matches.length === 1 && node.value.trim() === matches[0][0]) {
        const rawUrl = matches[0][1];

        // Validate URL for security
        if (!isValidVideoUrl(rawUrl)) {
          return; // Skip invalid URLs, leave original text
        }

        // Decode HTML entities for the final URL and then escape for HTML attributes
        const decodedUrl = decodeHtmlEntities(rawUrl);
        const escapedUrl = escapeHtmlAttribute(decodedUrl);
        const html = `<video src="${escapedUrl}" controls></video>`;

        node.type = "html";
        node.value = html;
        delete node.children;
        return;
      }

      // If there are multiple patterns or mixed content, split the text
      let newValue = node.value;
      for (const match of matches) {
        const rawUrl = match[1];

        // Validate URL for security
        if (!isValidVideoUrl(rawUrl)) {
          continue; // Skip invalid URLs, leave original pattern
        }

        // Decode HTML entities for the final URL and then escape for HTML attributes
        const decodedUrl = decodeHtmlEntities(rawUrl);
        const escapedUrl = escapeHtmlAttribute(decodedUrl);
        const html = `<video src="${escapedUrl}" controls></video>`;
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
