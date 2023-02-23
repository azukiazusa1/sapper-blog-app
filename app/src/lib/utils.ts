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

/**
 * 現在のルートの1つ目の階層が一致していれば true を返す
 */
export const isMatchPath = (path: string, current: string): boolean => {
  const [, currentFirst] = current.split('/')
  const [, pathFirst] = path.split('/')
  return pathFirst === currentFirst
}
