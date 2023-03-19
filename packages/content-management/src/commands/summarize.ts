import { createBlogFile, loadBlogPost } from '../fileOperation'
import { getSlug, getSummary } from '../getSummary'

const args = process.argv.slice(2)
if (!args[0]) {
  console.error('Usage: npm run summarize <markdown file path>')
  process.exit(1)
}

const markdown = await loadBlogPost(args[0])

if (!markdown.success) {
  console.error(markdown.error)
  process.exit(1)
}

if (!markdown.data.article) {
  console.error('article is empty')
  process.exit(1)
}

const slug = await getSlug(markdown.data.title ?? '')
const about = await getSummary(markdown.data.article)

console.log(slug)
console.log(about)

await createBlogFile({
  ...markdown.data,
  about,
  slug,
})
