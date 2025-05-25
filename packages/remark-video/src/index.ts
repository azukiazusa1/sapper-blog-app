import { visit } from "unist-util-visit";
import type { Plugin } from "unified";

/**
 * Sanitizes a URL to prevent XSS attacks
 * @param url The URL to sanitize
 * @returns The sanitized URL or null if invalid/dangerous
 */
function sanitizeUrl(url: string): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  // Remove leading/trailing whitespace
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return null;
  }

  try {
    // Parse the URL to validate it
    const parsedUrl = new URL(trimmedUrl);
    
    // Only allow http and https protocols
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }

    // Return the cleaned URL
    return parsedUrl.toString();
  } catch {
    // If URL parsing fails, check if it's a relative URL
    // For video files, we'll be conservative and only allow absolute URLs
    return null;
  }
}

/**
 * Escapes HTML characters in a string
 * @param text The text to escape
 * @returns The escaped text
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };
  
  return text.replace(/[&<>"']/g, (match) => htmlEscapes[match] || match);
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
        const url = matches[0][1];
        const sanitizedUrl = sanitizeUrl(url);
        
        if (!sanitizedUrl) {
          // If URL is invalid/dangerous, don't convert the pattern
          return;
        }
        
        const escapedUrl = escapeHtml(sanitizedUrl);
        const html = `<video src="${escapedUrl}" controls></video>`;

        node.type = "html";
        node.value = html;
        delete node.children;
        return;
      }

      // If there are multiple patterns or mixed content, split the text
      let newValue = node.value;
      for (const match of matches) {
        const url = match[1];
        const sanitizedUrl = sanitizeUrl(url);
        
        if (!sanitizedUrl) {
          // If URL is invalid/dangerous, skip this match
          continue;
        }
        
        const escapedUrl = escapeHtml(sanitizedUrl);
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
