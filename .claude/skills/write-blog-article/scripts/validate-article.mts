#!/usr/bin/env -S npx tsx

import { basename } from "node:path";
import { loadBlogPost } from "../../../../packages/content-management/src/fileOperation.ts";

const main = async () => {
  const articlePath = process.argv[2];

  if (!articlePath) {
    console.error("Usage: validate-article.mts <contents/blogPost/article.md>");
    process.exit(2);
  }

  const filename = basename(articlePath, ".md");
  const locale = articlePath.includes("/blogPost/en/") ? "en-GB" : "en-US";
  const result = await loadBlogPost(filename, locale);

  if (!result.success) {
    const error =
      result.error instanceof Error
        ? (result.error.stack ?? result.error.message)
        : JSON.stringify(result.error, null, 2);
    console.error(error);
    process.exit(1);
  }

  console.log(`Valid: ${articlePath}`);
};

void main();
