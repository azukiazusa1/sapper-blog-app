import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

export type VideoSize = { width: number; height: number };

/** 記事本文の表示幅は 756px。Retina でも 1512px なので 1280px あれば足りる */
const MAX_WIDTH = 1280;

export const probeVideoSize = async (filePath: string): Promise<VideoSize> => {
  const { stdout } = await run("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height",
    "-of",
    "csv=p=0",
    filePath,
  ]);

  const [width, height] = stdout.trim().split(",").map(Number);

  if (!width || !height) {
    throw new Error(`動画の寸法を取得できませんでした: ${filePath}`);
  }

  return { width, height };
};

/**
 * 常に H.264 の mp4 へ変換する。
 *
 * - scale: 記事幅を超える解像度を切り詰める。-2 は偶数に丸めた高さ
 * - an: GIF の置き換えが目的なので音声は落とす
 * - faststart: moov atom を先頭に移し、再生開始を早くする
 * - yuv420p: 画面収録の yuv444p は Safari で再生できないため変換する
 */
export const transcodeVideo = async (
  input: string,
  output: string,
): Promise<void> => {
  await run("ffmpeg", [
    "-y",
    "-i",
    input,
    "-vf",
    `scale='min(${MAX_WIDTH},iw)':-2`,
    "-c:v",
    "libx264",
    "-crf",
    "28",
    "-preset",
    "slow",
    "-an",
    "-movflags",
    "+faststart",
    "-pix_fmt",
    "yuv420p",
    output,
  ]);
};
