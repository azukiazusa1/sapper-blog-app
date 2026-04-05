import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, isAbsolute, resolve } from "node:path";
import { parseArgs } from "node:util";
import matter from "gray-matter";
import { generateBlogOgpImage, generateShortOgpImage } from "../generate.tsx";
import { checkImageExists, uploadImage } from "../r2.ts";

const commandFilePath = fileURLToPath(import.meta.url);
const repoRootPath = resolve(dirname(commandFilePath), "../../../..");

type ParsedGenerateInput = {
  file?: string;
  resolvedFile?: string;
  slug?: string;
  shortId?: string;
  title?: string;
  tags: string[];
};

type GenerateDependencies = {
  checkImageExists: typeof checkImageExists;
  uploadImage: typeof uploadImage;
  generateBlogOgpImage: typeof generateBlogOgpImage;
  generateShortOgpImage: typeof generateShortOgpImage;
};

function hash(input: string): string {
  return createHash("md5").update(input).digest("hex");
}

export function resolveMarkdownFilePath(filePath: string): string {
  if (isAbsolute(filePath)) {
    return filePath;
  }

  const cwdPath = resolve(process.cwd(), filePath);
  if (existsSync(cwdPath)) {
    return cwdPath;
  }

  const repoRelativePath = resolve(repoRootPath, filePath);
  if (existsSync(repoRelativePath)) {
    return repoRelativePath;
  }

  return filePath;
}

export function parseMarkdownFile(filePath: string): {
  slug: string;
  title: string;
  tags: string[];
} {
  const resolvedFilePath = resolveMarkdownFilePath(filePath);
  const content = readFileSync(resolvedFilePath, "utf-8");
  const { data } = matter(content);

  const slug = data["slug"];
  const title = data["title"];

  if (!slug || !title) {
    throw new Error(
      `Missing required frontmatter fields (slug, title) in ${filePath}`,
    );
  }

  const rawTags = data["tags"];
  const tags = Array.isArray(rawTags)
    ? rawTags.map((t: unknown) =>
        typeof t === "object" && t !== null && "name" in t
          ? String((t as { name: unknown }).name)
          : String(t),
      )
    : [];

  return { slug, title, tags };
}

export function parseGenerateInput(
  values: {
    file?: string;
    slug?: string;
    "short-id"?: string;
    title?: string;
    tags?: string;
  },
  positionals: string[],
): ParsedGenerateInput {
  const file = values.file ?? positionals[0];
  const resolvedFile = file ? resolveMarkdownFilePath(file) : undefined;

  if (positionals.length > 1) {
    throw new Error("Only one positional argument is supported");
  }

  let slug = values.slug;
  let shortId = values["short-id"];
  let title = values.title;
  let tags: string[] = values.tags ? values.tags.split(",") : [];

  if (resolvedFile) {
    const parsed = parseMarkdownFile(resolvedFile);
    slug = parsed.slug;
    title = parsed.title;
    tags = parsed.tags;
  }

  return {
    file,
    resolvedFile,
    shortId,
    slug,
    tags,
    title,
  };
}

export async function generateOgp(
  input: ParsedGenerateInput,
  deps: GenerateDependencies = {
    checkImageExists,
    generateBlogOgpImage,
    generateShortOgpImage,
    uploadImage,
  },
): Promise<void> {
  const { resolvedFile, shortId, slug, tags, title } = input;

  if (!title) {
    throw new Error("--title is required (or use --file)");
  }

  if (slug) {
    const isEnglish = resolvedFile?.includes("/blogPost/en/") ?? false;
    const key = isEnglish ? `blog/ogp/en/${slug}.png` : `blog/ogp/${slug}.png`;
    const contentHash = hash(title + JSON.stringify(tags));

    if (await deps.checkImageExists(key, contentHash)) {
      console.log(`[skip] ${key}`);
      return;
    }

    const png = await deps.generateBlogOgpImage(title, tags);
    await deps.uploadImage(key, png, contentHash);
    console.log(`[upload] ${key}`);
  } else if (shortId) {
    const key = `blog/shorts/ogp/${shortId}.png`;
    const contentHash = hash(title);

    if (await deps.checkImageExists(key, contentHash)) {
      console.log(`[skip] ${key}`);
      return;
    }

    const png = await deps.generateShortOgpImage(title);
    await deps.uploadImage(key, png, contentHash);
    console.log(`[upload] ${key}`);
  } else {
    throw new Error("--slug, --short-id, or --file is required");
  }
}

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    options: {
      file: { type: "string" },
      slug: { type: "string" },
      "short-id": { type: "string" },
      title: { type: "string" },
      tags: { type: "string" },
    },
    allowPositionals: true,
    strict: true,
  });

  const input = parseGenerateInput(values, positionals);
  await generateOgp(input);
}

if (process.argv[1] && resolve(process.argv[1]) === commandFilePath) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
