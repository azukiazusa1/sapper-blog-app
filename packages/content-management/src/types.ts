import type { MetaSysProps, MetaLinkProps } from 'contentful-management'
import { z } from 'zod'

export const BlogPostSchema = z.discriminatedUnion('published', [
  z.object({
    id: z.string(),
    about: z.string().max(255),
    article: z.string().max(50000),
    createdAt: z.string(),
    updatedAt: z.string(),
    title: z.string().max(255),
    slug: z
      .string()
      .max(255)
      .regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/),
    tags: z.array(z.string().max(50)),
    published: z.literal(true),
  }),
  z.object({
    id: z.string(),
    about: z.string().max(255).optional(),
    article: z.string().max(50000).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    title: z.string().max(255).optional(),
    slug: z
      .string()
      .max(255)
      .regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/)
      .optional(),
    tags: z.array(z.string().max(50)),
    published: z.literal(false),
  }),
])

export type BlogPost = z.infer<typeof BlogPostSchema>
export type PublishedBlogPost = Extract<BlogPost, { published: true }>
export type DraftBlogPost = Extract<BlogPost, { published: false }>

export type FieldValue<T> = {
  'en-US': T
}

export type ContentfulBlogPost = {
  metadata: { tags: [] }
  sys: MetaSysProps
  fields: {
    about: FieldValue<string>
    article: FieldValue<string>
    createdAt: FieldValue<string>
    updatedAt: FieldValue<string>
    thumbnail: FieldValue<MetaLinkProps>
    title: FieldValue<string>
    slug: FieldValue<string>
    tags: FieldValue<{ sys: MetaLinkProps }[]>
    relatedArticle: FieldValue<{ sys: MetaLinkProps[] }>
  }
}

export type ContentfulTag = {
  metadata: { tags: [] }
  sys: MetaSysProps
  fields: {
    name: FieldValue<string>
    slug: FieldValue<string>
  }
}
