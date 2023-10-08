import type { RequestHandler } from "@sveltejs/kit";
import type { AllPostsQuery } from "../../generated/graphql";
import RepositoryFactory, { POST } from "../../repositories/RepositoryFactory";
import variables from "$lib/variables";
const PostRepository = RepositoryFactory[POST];
export const prerender = true;

const siteUrl = variables.baseURL;

const renderXmlRssFeed = (
  posts: AllPostsQuery,
) => `<?xml version="1.0" encoding="UTF-8" ?>
  <rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
    <channel>
      <title>azukiazusa のテックブログ2</title>
      <link>${siteUrl}</link>
    <description>Web フロントエンド要素多めの技術ブログです。週に1度更新されます。</description>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <image>
        <url>${siteUrl}/favicon.png</url>
        <title>azukiazusa のテックブログ2</title>
        <link>${siteUrl}</link>
      </image>
      <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
      <language>
        <![CDATA[ja]]>
      </language>
    ${posts.blogPostCollection.items
      .map(
        (post) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="false">${siteUrl}/blog/${post.slug}</guid>
        <description><![CDATA[${post.about}]]></description>
        <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      </item>
    `,
      )
      .join("\n")}
    </channel>
  </rss>
`;

export const GET: RequestHandler = async () => {
  const posts = await PostRepository.findAll();
  const feed = renderXmlRssFeed(posts);

  const headers = {
    "Content-Type": "application/rss+xml",
    "Cache-Control": "max-age=0, s-max-age=3600",
  };

  return new Response(feed, {
    headers,
  });
};
