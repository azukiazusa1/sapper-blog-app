import type { MetaSysProps, MetaLinkProps } from 'contentful-management'

export type PublishedBlogPost = {
  id: string
  about: string
  article: string
  createdAt: string
  updatedAt: string
  title: string
  slug: string
  tags: string[]
  published: true
}

export type DraftBlogPost = {
  id: string
  about: string | undefined
  article: string | undefined
  createdAt: string | undefined
  updatedAt: string | undefined
  title: string | undefined
  slug: string | undefined
  tags: string[]
  published: false
}

export type BlogPost = PublishedBlogPost | DraftBlogPost

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
