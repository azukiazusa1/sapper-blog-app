import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

/**
 * Web で扱えない画像形式を PNG へ変換する。
 *
 * macOS のクリップボードは public.tiff が標準の画像型なので、
 * Zed に貼り付けた画像が .tiff で書き出されることがある。
 * TIFF は無圧縮のため、同じ絵でも PNG の 20 倍以上のサイズになる。
 * TIFF から PNG への変換は可逆で、アルファチャンネルも保たれる。
 */
export const convertImageToPng = async (
  input: string,
  output: string,
): Promise<void> => {
  await run("ffmpeg", [
    "-y",
    "-i",
    input,
    "-frames:v",
    "1",
    "-update",
    "1",
    output,
  ]);
};
