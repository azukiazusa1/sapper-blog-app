import { getBlogPosts } from '../api'
import { createBlogFile, deletePublishedBlogFile } from '../fileOperation'

const blogPosts = await getBlogPosts()
for (const blogPost of blogPosts) {
  await createBlogFile(blogPost)
  await deletePublishedBlogFile(blogPost)
}
