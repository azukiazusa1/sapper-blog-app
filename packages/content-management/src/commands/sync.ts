import { getBlogPosts, getLocalizedBlogPosts } from "../api.ts";
import { createBlogFile, deletePublishedBlogFile } from "../fileOperation.ts";

const blogPosts = await getBlogPosts();
for (const blogPost of blogPosts) {
  await createBlogFile(blogPost);
  await deletePublishedBlogFile(blogPost);
}

const englishBlogPosts = await getLocalizedBlogPosts("en-GB");
for (const blogPost of englishBlogPosts) {
  await createBlogFile(blogPost, "en-GB");
  await deletePublishedBlogFile(blogPost, "en-GB");
}
