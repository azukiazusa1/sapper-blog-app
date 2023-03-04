import { getBlogPosts } from '../api.js'
import { createBlogFile, deletePublishedBlogFile } from '../fileOperation.js'

const blogPosts = await getBlogPosts()
for (const blogPost of blogPosts) {
  await createBlogFile(blogPost)
  await deletePublishedBlogFile(blogPost)
}
