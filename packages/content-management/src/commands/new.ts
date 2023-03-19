import { createBlogFile } from '../fileOperation'
import { nanoid } from 'nanoid'
import { now } from '../datetime'

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
