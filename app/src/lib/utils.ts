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
  if (path.endsWith('/')) {
    return path.slice(0, -1)
  }
  return path
}
