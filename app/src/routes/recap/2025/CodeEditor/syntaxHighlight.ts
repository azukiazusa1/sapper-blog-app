import { codeToHtml } from "shiki";

/**
 * Shikiを使用してコードをハイライト
 * @param code ハイライトするコード
 * @param lang プログラミング言語（デフォルト: typescript）
 * @returns ハイライトされたHTML
 */
export async function highlightCode(
  code: string,
  lang: string = "typescript",
): Promise<string> {
  try {
    const html = await codeToHtml(code, {
      lang: lang,
      theme: "material-theme-darker",
    });
    return html;
  } catch (error) {
    console.error("Syntax highlighting failed:", error);
    // フォールバック: エスケープされたプレーンテキストを返す
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  }
}

/**
 * タブ名から言語を推測
 */
export function getLanguageForTab(tabName: string): string {
  if (tabName.endsWith(".ts")) return "typescript";
  if (tabName.endsWith(".svelte")) return "svelte";
  if (tabName.endsWith(".js")) return "javascript";
  return "typescript";
}

/**
 * HTMLエスケープ（フォールバック用）
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
