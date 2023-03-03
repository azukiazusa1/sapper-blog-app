import contentful from 'contentful-management'
import { Env } from './env.js'
import type {
  BlogPost,
  ContentfulBlogPost,
  ContentfulTag,
  DraftBlogPost,
  FieldValue,
  PublishedBlogPost,
  Thumbnail,
} from './types.js'

let environment: contentful.Environment

const createClient = async () => {
  if (environment) {
    return environment
  }
  const client = contentful.createClient({
    accessToken: Env.accessToken,
  })

  const space = await client.getSpace(Env.space)
  environment = await space.getEnvironment(Env.environments)
  return environment
}

const cache = new Map<string, ContentfulTag[]>()

const fetchTags = async (): Promise<ContentfulTag[]> => {
  if (cache.has('tags')) {
    return cache.get('tags') as ContentfulTag[]
  }
  const client = await createClient()

  const tags = await client.getEntries({
    content_type: 'tag',
  })

  cache.set('tags', tags.items as unknown as ContentfulTag[])

  return tags.items as unknown as ContentfulTag[]
}

const fetchBlogs = async (): Promise<ContentfulBlogPost[]> => {
  const client = await createClient()
  const posts = await client.getEntries({
    content_type: 'blogPost',
    limit: 1000,
  })
  return posts.items as unknown as ContentfulBlogPost[]
}

const fetchAsset = async (id: string): Promise<contentful.Asset | undefined> => {
  const asset = await environment.getAsset(id)
  return asset
}

const flattenField = <T>(field: FieldValue<T>): T => {
  return field['en-US']
}

const flattenOptionalField = <T>(field: FieldValue<T> | undefined): T | undefined => {
  return field ? field['en-US'] : undefined
}

/**
 * Contentful の Asset の ID を URL から取得する
 * Contentful の URL の形式は次の通り
 * https://images.ctfassets.net/{spaceId}/{assetId}/{token}{fileName}
 * なので、assetId は 3 番目のパスを取得すればよい
 * @param url Contentful の Asset の URL
 * @returns Contentful の Asset の ID
 */
const getAssetIdFromUrl = (url: string): string => {
  // prettier-ignore
  const [
    , /* https: */
    , /* '' */
    , /* images.ctfassets.net */
    , /* {spaceId} */
    assetId,
  ] = url.split('/')

  if (!assetId) {
    throw new Error('Invalid asset url' + url)
  }

  return assetId
}

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const tags = await fetchTags()
  const blogs = await fetchBlogs()

  const result = await Promise.all(
    blogs.map(async (blog) => {
      let thumbnail: Thumbnail | undefined
      if (blog.fields.thumbnail) {
        const asset = await fetchAsset(blog.fields.thumbnail['en-US'].sys.id)
        thumbnail = {
          url: 'https:' + asset?.fields.file['en-US']?.url || '',
          title: asset?.fields.title['en-US'] || '',
        }
      }

      const blogTags: string[] =
        blog.fields.tags?.['en-US']?.map((tag) => {
          const foundTag = tags.find((t) => t.sys.id === tag.sys.id)
          return foundTag ? flattenField(foundTag.fields.name) : ''
        }) ?? []

      if (contentful.isPublished(blog)) {
        if (thumbnail === undefined) throw new Error('公開済みの記事なら thumbnail は必ず存在するはず' + blog.sys.id)

        return {
          id: blog.sys.id,
          title: flattenField(blog.fields.title),
          slug: flattenField(blog.fields.slug),
          about: flattenField(blog.fields.about),
          article: flattenField(blog.fields.article),
          createdAt: flattenField(blog.fields.createdAt),
          updatedAt: flattenField(blog.fields.updatedAt),
          published: true,
          tags: blogTags,
          thumbnail,
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
          published: false,
          tags: blogTags,
          thumbnail,
        } satisfies DraftBlogPost
      }
    }),
  )
  return result
}

export const createBlogPost = async (blog: BlogPost): Promise<void> => {
  const tags = await fetchTags()
  const client = await createClient()
  const entry = await client.createEntry('blogPost', {
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
      thumbnail: blog.thumbnail
        ? {
            'en-US': {
              sys: {
                type: 'Link',
                linkType: 'Asset',
                id: getAssetIdFromUrl(blog.thumbnail.url),
              },
            },
          }
        : undefined,
    },
  })

  if (blog.published) {
    await entry.publish()
  }
}

export const updateBlogPost = async (blog: BlogPost): Promise<void> => {
  const client = await createClient()
  const entry = await client.getEntry(blog.id)

  const tags = await fetchTags()
  const fields = entry.fields

  if (blog.title) {
    fields['title'] = {
      'en-US': blog.title,
    }
  }
  if (blog.slug) {
    fields['slug'] = {
      'en-US': blog.slug,
    }
  }
  if (blog.about) {
    fields['about'] = {
      'en-US': blog.about,
    }
  }
  if (blog.article) {
    fields['article'] = {
      'en-US': blog.article,
    }
  }
  if (blog.createdAt) {
    fields['createdAt'] = {
      'en-US': blog.createdAt,
    }
  }
  if (blog.updatedAt) {
    fields['updatedAt'] = {
      'en-US': blog.updatedAt,
    }
  }

  fields['tags'] = {
    'en-US': blog.tags.map((tag) => {
      return {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: tags.find((t) => flattenField(t.fields.name) === tag)?.sys.id,
        },
      }
    }),
  }

  if (blog.thumbnail) {
    fields['thumbnail'] = {
      'en-US': {
        sys: {
          type: 'Link',
          linkType: 'Asset',
          id: getAssetIdFromUrl(blog.thumbnail.url),
        },
      },
    }
  }

  const updateEntry = await entry.update()

  if (blog.published) {
    await updateEntry.publish()
  }
}

export const deleteBlogPost = async (slugOrId: string): Promise<void> => {
  const client = await createClient()
  const entities = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': slugOrId,
  })

  // slug で検索してもヒットしなかった場合は id で検索する
  const entry = entities.items[0] ? entities.items[0] : await client.getEntry(slugOrId)

  await entry.delete()
}
