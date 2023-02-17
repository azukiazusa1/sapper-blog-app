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

const cache = new Map<string, ContentfulTag[]>()

const fetchTags = async (): Promise<ContentfulTag[]> => {
  if (cache.has('tags')) {
    return cache.get('tags') as ContentfulTag[]
  }

  const tags = await environment.getEntries({
    content_type: 'tag',
  })

  cache.set('tags', tags.items as unknown as ContentfulTag[])

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

export const createBlogPost = async (blog: BlogPost): Promise<void> => {
  const tags = await fetchTags()
  const entry = await environment.createEntry('blogPost', {
    fields: {
      title: {
        'en-US': blog.title,
      },
      slug: {
        'en-US': blog.slug,
      },
      about: {
        'en-US': blog.about,
      },
      article: {
        'en-US': blog.article,
      },
      createdAt: {
        'en-US': blog.createdAt,
      },
      updatedAt: {
        'en-US': blog.updatedAt,
      },
      tags: {
        'en-US': blog.tags.map((tag) => {
          return {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: tags.find((t) => flattenField(t.fields.name) === tag)?.sys.id,
            },
          }
        }),
      },
    },
  })

  if (blog.published) {
    await entry.publish()
  }
}

export const updateBlogPost = async (blog: BlogPost): Promise<void> => {
  const entry = await environment.getEntry(blog.id)
  const tags = await fetchTags()
  const fields = entry.fields

  fields['title']['en-US'] = blog.title
  fields['slug']['en-US'] = blog.slug
  fields['about']['en-US'] = blog.about
  fields['article']['en-US'] = blog.article
  fields['createdAt']['en-US'] = blog.createdAt
  fields['updatedAt']['en-US'] = blog.updatedAt
  fields['tags']['en-US'] = blog.tags.map((tag) => {
    return {
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id: tags.find((t) => flattenField(t.fields.name) === tag)?.sys.id,
      },
    }
  })

  await entry.update()

  if (blog.published) {
    await entry.publish()
  }
}

export const deleteBlogPost = async (id: string): Promise<void> => {
  const entry = await environment.getEntry(id)
  await entry.unpublish()
  await entry.delete()
}
