import contentful from 'contentful-management'
import { Env } from './env.js'
import type {
  BlogPost,
  ContentfulBlogPost,
  ContentfulTag,
  DraftBlogPost,
  FieldValue,
  PublishedBlogPost,
} from './types.js'

const client = contentful.createClient({
  accessToken: Env.accessToken,
})

const space = await client.getSpace(Env.space)
const environment = await space.getEnvironment(Env.environments)

const fetchTags = async (): Promise<ContentfulTag[]> => {
  const tags = await environment.getEntries({
    content_type: 'tag',
  })
  return tags.items as unknown as ContentfulTag[]
}

const fetchBlogs = async (): Promise<ContentfulBlogPost[]> => {
  const posts = await environment.getEntries({
    content_type: 'blogPost',
  })
  return posts.items as unknown as ContentfulBlogPost[]
}

const flattenField = <T>(field: FieldValue<T>): T => {
  return field['en-US']
}

const flattenOptionalField = <T>(field: FieldValue<T> | undefined): T | undefined => {
  return field ? field['en-US'] : undefined
}

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const tags = await fetchTags()
  const blogs = await fetchBlogs()

  return blogs.map((blog) => {
    const blogTags: string[] =
      blog.fields.tags?.['en-US']?.map((tag) => {
        const foundTag = tags.find((t) => t.sys.id === tag.sys.id)
        return foundTag ? flattenField(foundTag.fields.name) : ''
      }) ?? []

    if (contentful.isPublished(blog)) {
      return {
        id: blog.sys.id,
        title: flattenField(blog.fields.title),
        slug: flattenField(blog.fields.slug),
        about: flattenField(blog.fields.about),
        article: flattenField(blog.fields.article),
        createdAt: flattenField(blog.fields.createdAt),
        updatedAt: flattenField(blog.fields.updatedAt),
        thumbnail: flattenField(blog.fields.thumbnail),
        published: true,
        tags: blogTags,
      } satisfies PublishedBlogPost
    } else {
      return {
        id: blog.sys.id,
        title: flattenOptionalField(blog.fields.title),
        slug: flattenOptionalField(blog.fields.slug),
        about: flattenOptionalField(blog.fields.about),
        article: flattenOptionalField(blog.fields.article),
        createdAt: flattenOptionalField(blog.fields.createdAt),
        updatedAt: flattenOptionalField(blog.fields.updatedAt),
        thumbnail: flattenOptionalField(blog.fields.thumbnail),
        published: false,
        tags: blogTags,
      } satisfies DraftBlogPost
    }
  })
}
