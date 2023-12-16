import { getBlogPosts, getPopularPosts } from "../api";
import type { PublishedBlogPost } from "../types";

const year = process.argv[2];

if (!year) {
  console.error("Please provide a year");
  process.exit(1);
}

console.log(`Recap for year ${year}`);

const blogPosts = await getBlogPosts({
  createdAt: {
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
  },
});

const publishedBlogPosts = blogPosts.filter(
  (post): post is PublishedBlogPost => post.published,
);

console.log(`Total: ${publishedBlogPosts.length} posts`);

const wordCount = publishedBlogPosts.reduce((acc, post) => {
  // 改行や空白を除去して、単語数を数える
  return acc + post.article.replace(/\s/g, "").length;
}, 0);

console.log(`Total word count: ${wordCount}`);

const mostFrequentTags = publishedBlogPosts
  .flatMap((post) => post.tags)
  .reduce((acc, tag) => {
    acc.set(tag, (acc.get(tag) || 0) + 1);
    return acc;
  }, new Map<string, number>());

console.log(
  `Most frequent tags: ${[...mostFrequentTags.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag, count]) => `${tag} (${count})`)
    .join(", ")}`,
);

const popularPosts = await getPopularPosts({
  startDate: `${year}-01-01`,
  endDate: `${year}-12-31`,
});

console.log(`Popular posts: 
${popularPosts
  .map((post) => `${post.title} ${post.path} (${post.views})`)
  .join("\n")}`);
