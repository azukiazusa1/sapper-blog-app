import { getBlogPosts } from './src/api.js'
import { createBlogFile, deletePublishedBlogFile } from './src/fileOperation.js'

const blogPosts = await getBlogPosts()
for (const blogPost of blogPosts) {
  await createBlogFile(blogPost)
  await deletePublishedBlogFile(blogPost)
}
