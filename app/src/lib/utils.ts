import type { TocItem } from "./server/markdownToHtml";

/**
 * 末尾のスラッシュを削除する
 *
 * @example
 *
 * ```ts
 * removeTrailingSlash('/foo/bar/') // => '/foo/bar'
 * removeTrailingSlash('/foo/bar') // => '/foo/bar'
 * ```
 *
 * @param path パス
 * @returns スラッシュを削除したパス
 */
export const removeTrailingSlash = (path: string): string => {
  if (path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
};

/**
 * 現在のルートの1つ目の階層が一致していれば true を返す
 */
export const isMatchPath = (path: string, current: string): boolean => {
  const [, currentFirst] = current.split("/");
  const [, pathFirst] = path.split("/");
  return pathFirst === currentFirst;
};

export function extractToc(htmlString: string): TocItem[] {
  const toc: TocItem[] = [];
  const headingRegex = /<(h[2-4])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g;
  let match;
  while ((match = headingRegex.exec(htmlString)) !== null) {
    const level = parseInt(match[1].charAt(1), 10);
    const id = match[2];
    // タグを除去してテキストだけ抽出
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    toc.push({ id, text, level });
  }
  return toc;
}
