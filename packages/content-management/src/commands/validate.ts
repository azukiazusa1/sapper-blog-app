import { loadBlogPost } from "../fileOperation.ts";
import { basename } from "path";
import { getOctokit } from "@actions/github";

const { ADDED_FILES, MODIFIED_FILES, OWNER, REPO, PR_NUMBER, TOKEN } =
  process.env;

console.log("Added files:", ADDED_FILES);
console.log("Modified files:", MODIFIED_FILES);

const owner = OWNER as string;
const repo = REPO as string;
const pr_number = Number(PR_NUMBER);
const token = TOKEN as string;

const octokit = getOctokit(token);

const getFilename = (path: string) => basename(path, ".md");

const bodyTemplate = (
  file: string,
  error: unknown
) => `## ファイルの検証に失敗しました。
### ファイル名
\`${file}\`
### エラー内容
\`\`\`json
${JSON.stringify(error, null, 2)}
\`\`\`
`;

let hasError = false;

if (ADDED_FILES) {
  const addedFiles = ADDED_FILES.split(" ");
  for (const file of addedFiles) {
    const filename = getFilename(file);
    const result = await loadBlogPost(filename);
    if (!result.success) {
      hasError = true;
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: pr_number,
        body: bodyTemplate(file, result.error),
      });
    }
  }
}

if (MODIFIED_FILES) {
  const modifiedFiles = MODIFIED_FILES.split(" ");
  for (const file of modifiedFiles) {
    const filename = getFilename(file);
    const result = await loadBlogPost(filename);
    if (!result.success) {
      hasError = true;
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: pr_number,
        body: bodyTemplate(file, result.error),
      });
    }
  }
}

if (hasError) {
  process.exit(1);
}
