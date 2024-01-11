import type { RequestHandler } from "@sveltejs/kit";
import type { AllPostsQuery } from "../../generated/graphql";
import RepositoryFactory, {
  POST,
  SHORT,
} from "../../repositories/RepositoryFactory";
import variables from "$lib/variables";
const PostRepository = RepositoryFactory[POST];
const ShortRepository = RepositoryFactory[SHORT];
export const prerender = true;

const siteUrl = variables.baseURL;

type Item = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

const renderXmlRssFeed = (
  items: Item[],
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
    ${items
      .map(
        (item) => `
      <item>
        <title><![CDATA[${item.title}]]></title>
        <link><![CDATA[${item.link}]]></link>
      <guid isPermaLink="false"><![CDATA[${item.link}]]></guid>
        <description><![CDATA[${item.description}]]></description>
        <pubDate>${item.pubDate}</pubDate>
      </item>
    `,
      )
      .join("\n")}
    </channel>
  </rss>
`;

export const GET: RequestHandler = async () => {
  const posts = await PostRepository.findAll();
  const shorts = await ShortRepository.getAll();

  // posts と shorts を結合して、createdAt でソートする
  const items = [
    ...posts.blogPostCollection.items,
    ...shorts.shortCollection.items,
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .map((item) => {
      const date = new Date(item.createdAt);
      const pubDate = `${date.toUTCString()}`;

      const link =
        item.__typename === "BlogPost"
          ? `${siteUrl}/blog/${item.slug}`
          : `${siteUrl}/blog/short/${item.sys.id}`;
      const description =
        item.__typename === "BlogPost" ? item.about : item.content1;

      return {
        title: item.title,
        description,
        link,
        pubDate,
      };
    });

  const feed = renderXmlRssFeed(items);

  const headers = {
    "Content-Type": "application/rss+xml",
    "Cache-Control": "max-age=0, s-max-age=3600",
  };

  return new Response(feed, {
    headers,
  });
};
