import {
  access,
  mkdtemp,
  readFile,
  rm,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import yamlFront from "yaml-front-matter";
import { uploadAsset } from "./api.ts";
import { convertImageToPng } from "./image.ts";
import {
  assetFileName,
  contentTypeOf,
  findLocalMedia,
  isSupported,
  needsImageConversion,
  nextSequence,
  replaceReference,
  type MediaReference,
} from "./media.ts";
import { probeVideoSize, transcodeVideo, type VideoSize } from "./video.ts";

const exists = (filePath: string) =>
  access(filePath).then(
    () => true,
    () => false,
  );

const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

type Target = { label: string; filePath: string; content: string };

/**
 * 同じファイルが日英の両方から参照されることがあるため basename で束ね、
 * 1 度だけアップロードする。参照先は md のあるディレクトリを基準に解決するので、
 * Zed が挿入するパスの形式に依存しない。
 */
type Job = { reference: MediaReference; sourcePath: string };

export const uploadMedia = async ({
  blogPostDir,
  id,
  dryRun = false,
  log = console.log,
}: {
  blogPostDir: string;
  id: string;
  dryRun?: boolean;
  log?: (message: string) => void;
}): Promise<void> => {
  const targets: Target[] = [];

  for (const [label, filePath] of [
    ["ja", join(blogPostDir, `${id}.md`)],
    ["en", join(blogPostDir, "en", `${id}.md`)],
  ] as const) {
    if (await exists(filePath)) {
      targets.push({
        label,
        filePath,
        content: await readFile(filePath, "utf-8"),
      });
    }
  }

  if (targets.length === 0) {
    throw new Error(`記事が見つかりません: ${id}`);
  }

  const slug = yamlFront.loadFront(targets[0]!.content)["slug"];

  if (typeof slug !== "string" || !slug) {
    throw new Error(
      `frontmatter に slug がありません: ${targets[0]!.filePath}`,
    );
  }

  const jobs = new Map<string, Job>();
  const missing: string[] = [];
  const unsupported: string[] = [];

  for (const target of targets) {
    for (const reference of findLocalMedia(target.content)) {
      const fileName = basename(reference.filePath);

      if (jobs.has(fileName)) {
        continue;
      }

      if (!isSupported(reference)) {
        unsupported.push(`${reference.raw} (${target.label})`);
        continue;
      }

      let sourcePath: string | undefined;

      for (const candidate of targets.map((t) =>
        join(dirname(t.filePath), fileName),
      )) {
        if (await exists(candidate)) {
          sourcePath = candidate;
          break;
        }
      }

      if (!sourcePath) {
        missing.push(`${reference.raw} (${target.label})`);
        continue;
      }

      jobs.set(fileName, { reference, sourcePath });
    }
  }

  // アップロードを 1 件も始める前に、参照先と形式が揃っていることを確かめる
  if (missing.length > 0) {
    throw new Error(
      `参照先のファイルが見つかりません:\n  ${missing.join("\n  ")}`,
    );
  }

  if (unsupported.length > 0) {
    throw new Error(`対応していない形式です:\n  ${unsupported.join("\n  ")}`);
  }

  if (jobs.size === 0) {
    log(`アップロードが必要なローカルの画像・動画はありません: ${id}`);
    return;
  }

  const workDir = await mkdtemp(join(tmpdir(), "upload-media-"));

  let sequence = nextSequence(
    targets.map((t) => t.content),
    slug,
  );

  try {
    for (const [fileName, { reference, sourcePath }] of jobs) {
      const assetName = assetFileName(slug, sequence, reference);

      // 動画は常に H.264 mp4 へ変換する。寸法は remark-video が width / height にする
      // TIFF などの画像は PNG へ変換する
      let uploadPath = sourcePath;
      let size: VideoSize | undefined;

      if (reference.kind === "video") {
        uploadPath = join(workDir, assetName);
        await transcodeVideo(sourcePath, uploadPath);
        size = await probeVideoSize(uploadPath);
      } else if (needsImageConversion(reference)) {
        uploadPath = join(workDir, assetName);
        await convertImageToPng(sourcePath, uploadPath);
      }

      const before = (await stat(sourcePath)).size;
      const after = (await stat(uploadPath)).size;
      const sizes =
        uploadPath === sourcePath
          ? formatSize(after)
          : `${formatSize(before)} -> ${formatSize(after)}`;
      const detail = size
        ? ` ${size.width}x${size.height} ${sizes}`
        : ` ${sizes}`;

      if (dryRun) {
        log(`[dry-run] ${fileName} -> ${assetName}${detail}`);
        sequence++;
        continue;
      }

      const { url } = await uploadAsset({
        filePath: uploadPath,
        fileName: assetName,
        contentType: contentTypeOf(assetName),
        title: assetName,
      });

      // 1 件ずつ「アップロード → 置換 → 削除」を完結させる。
      // 途中で失敗しても成功分は確定し、再実行は残りだけを処理する。
      for (const target of targets) {
        const replaced = replaceReference(target.content, reference, url, size);

        if (replaced !== target.content) {
          target.content = replaced;
          await writeFile(target.filePath, replaced, "utf-8");
        }
      }

      await unlink(sourcePath);

      log(`${fileName} -> ${assetName}${detail}`);
      log(`  ${url}`);

      sequence++;
    }
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }

  if (dryRun) {
    log(
      `\n${jobs.size} 件が対象です。--dry-run を外すとアップロードして ${targets
        .map((t) => t.label)
        .join(" / ")} の本文を書き換えます。`,
    );
  }
};
