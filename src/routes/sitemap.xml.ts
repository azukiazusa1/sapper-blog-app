import type { RequestHandler } from '@sveltejs/kit'
import type { AllPostsQuery, TagsQuery } from '../generated/graphql'
import RepositoryFactory, { POST, TAG } from '../repositories/RepositoryFactory'
import variables from '$lib/variables'
const PostRepository = RepositoryFactory[POST]
const TagRepository = RepositoryFactory[TAG]

const siteUrl = variables.baseURL

const renderXmlSitemap = (posts: AllPostsQuery, tags: TagsQuery) => {
  const total = posts.blogPostCollection.items.length
  const limit = 12
  const pageNum = Math.ceil(total / limit)
  const pages = Array.from({ length: pageNum }, (_, i) => i + 1)

  return `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
  <url>
    <loc>${siteUrl}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${siteUrl}/blog/page/${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  `,
    )
    .join('\n')}
  ${posts.blogPostCollection.items
    .map(
      (post) => `
      <url>
        <loc>${siteUrl}/blog/${post.slug}</loc>
        <priority>0.9</priority>
        <lastmod>${new Date(post.createdAt).toUTCString()}</lastmod>
      </url>
    `,
    )
    .join('\n')}
  <url>
    <loc>${siteUrl}/about</loc>
    <priority>0.1</priority>
  </url>
  <url>
    <loc>${siteUrl}/tags</loc>
    <priority>0.2</priority>
  </url>
  ${tags.tagCollection.items
    .map(
      (tag) => `
      <url>
        <loc>${siteUrl}/tags/${tag.slug}</loc>
        <priority>0.3</priority>
      </url>
    `,
    )
    .join('\n')}
</urlset>
`
}

export const get: RequestHandler = async () => {
  const posts = await PostRepository.findAll()
  const tags = await TagRepository.get()
  const feed = renderXmlSitemap(posts, tags)

  const headers = {
    'Content-Type': 'application/xml',
    'Cache-Control': 'max-age=0, s-max-age=3600',
  }

  return {
    headers,
    body: feed,
  }
}
