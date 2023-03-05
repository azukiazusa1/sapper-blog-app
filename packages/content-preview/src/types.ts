export type BlogPostFromtMatter = {
  id: string
  slug: string
  title: string
  about: string
  createdAt: string
  updatedAt: string
  tags: string[]
  thumbnail?: {
    url: string
    title: string
  }
  published: boolean
}
