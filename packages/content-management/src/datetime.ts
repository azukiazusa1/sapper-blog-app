/**
 * 現在時刻を以下の形式で返す
 * 2021-10-10T00:00+09:00
 */
export const now = (): string => {
  const date = new Date()
  const jpDate = new Date(date.toLocaleString('ja-JP'))

  const pad = (num: number) => {
    return num.toString().padStart(2, '0')
  }

  const year = jpDate.getFullYear()
  const month = pad(jpDate.getMonth() + 1)
  const day = pad(jpDate.getDate())
  const hour = pad(jpDate.getHours())
  const minute = pad(jpDate.getMinutes())

  return `${year}-${month}-${day}T${hour}:${minute}+09:00`
}
