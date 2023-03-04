import { createBlogFile } from '../fileOperation.js'
import { nanoid } from 'nanoid'
import { now } from '../datetime.js'

const id = nanoid()

await createBlogFile({
  id,
  title: undefined,
  slug: undefined,
  about: undefined,
  article: undefined,
  createdAt: now(),
  updatedAt: now(),
  tags: [],
  thumbnail: undefined,
  published: false,
})

console.log(`Created new blog post: ${id}`)
