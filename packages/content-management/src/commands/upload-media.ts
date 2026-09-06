import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { uploadMedia } from "../uploadMedia.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

const [id, ...options] = process.argv.slice(2);

if (!id) {
  console.error(
    "記事 ID を指定してください: npm run upload:media -w=packages/content-management -- <記事 ID> [--dry-run]",
  );
  process.exit(1);
}

try {
  await uploadMedia({
    blogPostDir: join(__dirname, "../../../../contents/blogPost"),
    id,
    dryRun: options.includes("--dry-run"),
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
