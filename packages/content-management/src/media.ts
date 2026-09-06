import path from "path";

export type MediaKind = "image" | "video";

export type MediaReference = {
  kind: MediaKind;
  /** マッチした記法全体。置換時にそのまま差し替える */
  raw: string;
  /** 参照先のローカルパス */
  filePath: string;
  /** `![alt](...)` の alt。動画は空文字 */
  alt: string;
};

/** `![alt](path)`。パスに空白は許さない（Zed が生成する名前は空白を含まない） */
const IMAGE_PATTERN = /!\[([^\]]*)\]\(\s*([^)\s]+)\s*\)/g;

/** `!v(path)` または `!v(path 1280x720)` */
const VIDEO_PATTERN = /!v\(\s*([^)\s]+)(?:\s+\d+x\d+)?\s*\)/g;

/** 既存記事は `//images.ctfassets.net/...` のプロトコル相対 URL も使っている */
const isRemote = (url: string) => /^(?:https?:)?\/\//.test(url);

/** そのまま Contentful へ上げられる画像形式 */
const PASSTHROUGH_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

/**
 * PNG へ変換してから上げる画像形式。
 *
 * macOS のクリップボードは public.tiff が標準の画像型なので、
 * Zed の貼り付けが .tiff になることがある。
 */
const CONVERTED_IMAGE_EXTENSIONS = [".tiff", ".tif", ".bmp", ".heic", ".heif"];

const VIDEO_EXTENSIONS = [".mov", ".mp4"];

const extensionOf = (filePath: string) => path.extname(filePath).toLowerCase();

/** TIFF などは PNG に変換してからアップロードする */
export const needsImageConversion = (reference: MediaReference): boolean =>
  reference.kind === "image" &&
  CONVERTED_IMAGE_EXTENSIONS.includes(extensionOf(reference.filePath));

/** アップロードできる形式かどうか。1 件も上げる前に確かめる */
export const isSupported = (reference: MediaReference): boolean => {
  const extension = extensionOf(reference.filePath);

  return reference.kind === "video"
    ? VIDEO_EXTENSIONS.includes(extension)
    : PASSTHROUGH_IMAGE_EXTENSIONS.includes(extension) ||
        CONVERTED_IMAGE_EXTENSIONS.includes(extension);
};

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
};

export const contentTypeOf = (fileName: string): string => {
  const contentType = CONTENT_TYPES[path.extname(fileName).toLowerCase()];

  if (!contentType) {
    throw new Error(`対応していない拡張子です: ${fileName}`);
  }

  return contentType;
};

/**
 * 本文からアップロードされていないローカルの画像・動画参照を、出現順に取り出す。
 */
export const findLocalMedia = (article: string): MediaReference[] => {
  const references: MediaReference[] = [];

  for (const match of article.matchAll(IMAGE_PATTERN)) {
    const [raw, alt, filePath] = match;

    if (filePath && !isRemote(filePath)) {
      references.push({ kind: "image", raw, filePath, alt: alt ?? "" });
    }
  }

  for (const match of article.matchAll(VIDEO_PATTERN)) {
    const [raw, filePath] = match;

    if (filePath && !isRemote(filePath)) {
      references.push({ kind: "video", raw, filePath, alt: "" });
    }
  }

  return references;
};

/**
 * 記事内で既に使われている連番の次の値を返す。
 *
 * 一度アップロードした記事に画像を足して再実行したとき、
 * 既存の `<slug>-1.png` と衝突しないようにする。
 */
export const nextSequence = (articles: string[], slug: string): number => {
  const pattern = new RegExp(`${slug}-(\\d+)\\.[A-Za-z0-9]+`, "g");
  let max = 0;

  for (const article of articles) {
    for (const [, sequence] of article.matchAll(pattern)) {
      max = Math.max(max, Number(sequence));
    }
  }

  return max + 1;
};

/**
 * `<slug>-<連番>.<拡張子>` を組み立てる。動画は常に mp4 へ変換する。
 */
export const assetFileName = (
  slug: string,
  sequence: number,
  reference: MediaReference,
): string => {
  if (reference.kind === "video") {
    return `${slug}-${sequence}.mp4`;
  }

  const extension = needsImageConversion(reference)
    ? ".png"
    : extensionOf(reference.filePath);

  return `${slug}-${sequence}${extension}`;
};

/**
 * 同じファイルを指すローカル参照を、アップロード後の記法へすべて置き換える。
 *
 * 日本語と英語で alt が異なることがあるため、マッチした文字列ではなく
 * 参照先のファイル名で照合し、alt は各出現のものを保つ。
 *
 * 動画には寸法を付ける。remark-video が width / height として出力し、
 * 読み込み前後のレイアウトシフトを防ぐ。
 */
export const replaceReference = (
  article: string,
  reference: MediaReference,
  url: string,
  size?: { width: number; height: number },
): string => {
  const fileName = path.basename(reference.filePath);
  const isSameFile = (filePath: string) =>
    !isRemote(filePath) && path.basename(filePath) === fileName;

  if (reference.kind === "image") {
    return article.replace(
      new RegExp(IMAGE_PATTERN.source, "g"),
      (raw, alt: string, filePath: string) =>
        isSameFile(filePath) ? `![${alt}](${url})` : raw,
    );
  }

  const dimensions = size ? ` ${size.width}x${size.height}` : "";

  return article.replace(
    new RegExp(VIDEO_PATTERN.source, "g"),
    (raw, filePath: string) =>
      isSameFile(filePath) ? `!v(${url}${dimensions})` : raw,
  );
};
