import type { RequestHandler } from '@sveltejs/kit'
import type { AllPostsQuery } from "../generated/graphql";
import RepositoryFactory, { POST } from '../repositories/RepositoryFactory'
const PostRepository = RepositoryFactory[POST]

const siteUrl = process.env.BASE_URL

const renderXmlRssFeed = (posts: AllPostsQuery) => `<?xml version="1.0" encoding="UTF-8" ?>
  <rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
    <channel>
      <title><![CDATA[David's Blog]]></title>
      <link>${siteUrl}</link>
    <description><![CDATA[A developer's blog. Might be useful. Maybe.]]></description>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <image>
        <url>${siteUrl}/profile-pic-small.jpg</url>
        <title><![CDATA[David's Blog]]></title>
        <link>${siteUrl}</link>
      </image>
    ${posts.blogPostCollection.items.map(post => `
      <item>
        <title>${post.title}</title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="false">${siteUrl}/blog/${post.slug}</guid>
        <description><![CDATA[${post.about}]]></description>
        <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      </item>
    `).join('\n')}
    </channel>
  </rss>
`;

export const get: RequestHandler = async () => {
  const posts = await PostRepository.findAll()
  const feed = renderXmlRssFeed(posts)
  return {
    headers: {
      'Cache-Control': 'max-age=0, s-max-age=600',
      'Content-Type': 'application/rss+xml; charset=utf-8'
    },
    body: feed
  }
}