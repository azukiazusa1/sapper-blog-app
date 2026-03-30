import { createBlogPost, updateBlogPost, deleteBlogPost } from "../api.ts";
import { loadBlogPost } from "../fileOperation.ts";
import { basename } from "path";

const { ADDED_FILES, MODIFIED_FILES, DELETED_FILES } = process.env;

console.log("Added files:", ADDED_FILES);
console.log("Modified files:", MODIFIED_FILES);
console.log("Deleted files:", DELETED_FILES);

const isEnglishFile = (filePath: string) =>
  filePath.includes("/blogPost/en/") || filePath.includes("blogPost/en/");

const getFilename = (filePath: string) => basename(filePath, ".md");

if (ADDED_FILES) {
  const addedFiles = ADDED_FILES.split(" ");
  let hasError = false;
  for (const file of addedFiles) {
    const filename = getFilename(file);
    if (isEnglishFile(file)) {
      // 英語ファイルは既存エントリの en-GB locale を更新する
      const result = await loadBlogPost(filename, "en-GB");
      if (!result.success) {
        hasError = true;
        console.error(result.error);
        continue;
      }
      await updateBlogPost(result.data, "en-GB");
    } else {
      const result = await loadBlogPost(filename);
      if (!result.success) {
        hasError = true;
        console.error(result.error);
        continue;
      }
      await createBlogPost(result.data);
    }
  }
  if (hasError) {
    process.exit(1);
  }
}

if (MODIFIED_FILES) {
  const modifiedFiles = MODIFIED_FILES.split(" ");
  let hasError = false;
  for (const file of modifiedFiles) {
    const filename = getFilename(file);
    if (isEnglishFile(file)) {
      const result = await loadBlogPost(filename, "en-GB");
      if (!result.success) {
        hasError = true;
        console.error(result.error);
        continue;
      }
      await updateBlogPost(result.data, "en-GB");
    } else {
      const result = await loadBlogPost(filename);
      if (!result.success) {
        hasError = true;
        console.error(result.error);
        continue;
      }
      await updateBlogPost(result.data);
    }
  }
  if (hasError) {
    process.exit(1);
  }
}

if (DELETED_FILES) {
  const deletedFiles = DELETED_FILES.split(" ");
  for (const file of deletedFiles) {
    if (isEnglishFile(file)) {
      // 英語ファイルの削除は en-GB フィールドのクリアのみ（エントリ自体は削除しない）
      console.log(`Skipping deletion of English file: ${file}`);
      continue;
    }
    const filename = getFilename(file);
    await deleteBlogPost(filename);
  }
}
