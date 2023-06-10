import { getBlogPosts } from "../api.ts";
import { createBlogFile, deletePublishedBlogFile } from "../fileOperation.ts";

const blogPosts = await getBlogPosts();
for (const blogPost of blogPosts) {
  await createBlogFile(blogPost);
  await deletePublishedBlogFile(blogPost);
}
