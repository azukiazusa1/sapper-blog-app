import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import matter from "gray-matter";
import { generateBlogOgpImage, generateShortOgpImage } from "../generate.tsx";
import { checkImageExists, uploadImage } from "../r2.ts";

function hash(input: string): string {
  return createHash("md5").update(input).digest("hex");
}

function parseMarkdownFile(filePath: string): {
  slug: string;
  title: string;
  tags: string[];
} {
  const content = readFileSync(filePath, "utf-8");
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

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      file: { type: "string" },
      slug: { type: "string" },
      "short-id": { type: "string" },
      title: { type: "string" },
      tags: { type: "string" },
    },
    strict: true,
  });

  let slug = values.slug;
  let shortId = values["short-id"];
  let title = values.title;
  let tags: string[] = values.tags ? values.tags.split(",") : [];

  if (values.file) {
    const parsed = parseMarkdownFile(values.file);
    slug = parsed.slug;
    title = parsed.title;
    tags = parsed.tags;
  }

  if (!title) {
    throw new Error("--title is required (or use --file)");
  }

  if (slug) {
    const key = `blog/ogp/${slug}.png`;
    const contentHash = hash(title + JSON.stringify(tags));

    if (await checkImageExists(key, contentHash)) {
      console.log(`[skip] ${key}`);
      return;
    }

    const png = await generateBlogOgpImage(title, tags);
    await uploadImage(key, png, contentHash);
    console.log(`[upload] ${key}`);
  } else if (shortId) {
    const key = `blog/shorts/ogp/${shortId}.png`;
    const contentHash = hash(title);

    if (await checkImageExists(key, contentHash)) {
      console.log(`[skip] ${key}`);
      return;
    }

    const png = await generateShortOgpImage(title);
    await uploadImage(key, png, contentHash);
    console.log(`[upload] ${key}`);
  } else {
    throw new Error("--slug, --short-id, or --file is required");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
