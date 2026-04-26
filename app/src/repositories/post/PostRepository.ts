import type { PostRepositoryInterFace } from "./types";
import { postsQuery } from "../../queries/Posts";
import type {
  AllPostsQuery,
  BlogPostOrder,
  PostBySlugQuery,
  PostsQuery,
  PostsQueryVariables,
  PreviewPostQuery,
  PreviewPostsQuery,
  SearchPostsQuery,
  SearchPostsQueryVariables,
} from "../../generated/graphql";
import { postBySlugQuery } from "../../queries/PostBySlug";
import { searchPostsQuery } from "../../queries/SearchPosts";
import { request } from "../client";
import { allPostsQuery } from "../../queries/AllPosts";
import { allPostsWithDetailsQuery } from "../../queries/AllPostsWithDetails";
import { PreviewPosts } from "../../queries/PreviewPosts";
import { previewPost } from "../../queries/PreviewPost";
import { building } from "$app/environment";

type BlogPostCollection = NonNullable<AllPostsQuery["blogPostCollection"]> & {
  total: number;
  skip: number;
  limit: number;
  items: NonNullable<PostBySlugQuery["blogPostCollection"]>["items"];
};

type CachedAllPostsQuery = Omit<AllPostsQuery, "blogPostCollection"> & {
  blogPostCollection: BlogPostCollection;
};

const allPostsCache = new Map<string, Promise<CachedAllPostsQuery>>();

const cacheKey = ({
  locale,
  order,
}: {
  locale?: string | null;
  order?: BlogPostOrder | null;
}) => `${locale ?? "default"}:${order ?? "createdAt_DESC"}`;

const compareNullableString = (
  a: string | null | undefined,
  b: string | null | undefined,
) => (a ?? "").localeCompare(b ?? "");

const compareNullableDate = (
  a: string | null | undefined,
  b: string | null | undefined,
) => new Date(a ?? 0).getTime() - new Date(b ?? 0).getTime();

const getUpdatedAt = (
  post: BlogPostCollection["items"][number],
): string | null | undefined =>
  (post as { updatedAt?: string | null } | null | undefined)?.updatedAt;

const sortPosts = (
  posts: BlogPostCollection["items"],
  order: BlogPostOrder | null | undefined,
) => {
  const sortedPosts = [...posts];

  switch (order) {
    case "createdAt_ASC":
      return sortedPosts.sort((a, b) =>
        compareNullableDate(a?.createdAt, b?.createdAt),
      );
    case "title_ASC":
      return sortedPosts.sort((a, b) =>
        compareNullableString(a?.title, b?.title),
      );
    case "title_DESC":
      return sortedPosts.sort((a, b) =>
        compareNullableString(b?.title, a?.title),
      );
    case "updatedAt_ASC":
      return sortedPosts.sort((a, b) =>
        compareNullableDate(getUpdatedAt(a), getUpdatedAt(b)),
      );
    case "updatedAt_DESC":
      return sortedPosts.sort((a, b) =>
        compareNullableDate(getUpdatedAt(b), getUpdatedAt(a)),
      );
    case "createdAt_DESC":
    default:
      return sortedPosts.sort((a, b) =>
        compareNullableDate(b?.createdAt, a?.createdAt),
      );
  }
};

export class PostRepository implements PostRepositoryInterFace {
  private getCachedAllPosts({
    locale,
    order,
  }: Pick<PostsQueryVariables, "locale" | "order"> = {}) {
    const key = cacheKey({ locale, order });
    const cachedPosts = allPostsCache.get(key);

    if (cachedPosts) {
      return cachedPosts;
    }

    const posts = request(allPostsWithDetailsQuery, { locale, order }).then(
      (result) => result as CachedAllPostsQuery,
    );
    allPostsCache.set(key, posts);

    return posts;
  }

  async get(queryVariables: PostsQueryVariables) {
    if (building) {
      const { limit = 12, skip = 0, locale, order } = queryVariables;
      const resolvedLimit = limit ?? 12;
      const resolvedSkip = skip ?? 0;
      const posts = await this.getCachedAllPosts({ locale, order });
      const items = sortPosts(posts.blogPostCollection.items, order).slice(
        resolvedSkip,
        resolvedSkip + resolvedLimit,
      );

      return {
        ...posts,
        blogPostCollection: {
          ...posts.blogPostCollection,
          total: posts.blogPostCollection.items.length,
          skip: resolvedSkip,
          limit: resolvedLimit,
          items,
        },
      } as PostsQuery;
    }

    const posts = await request(postsQuery, queryVariables);
    return posts as PostsQuery;
  }

  async search(queryVariables: SearchPostsQueryVariables) {
    const posts = await request(searchPostsQuery, queryVariables);

    return posts as SearchPostsQuery;
  }

  async find(slug: string, locale?: string) {
    if (building) {
      const posts = await this.getCachedAllPosts({ locale });
      const item = posts.blogPostCollection.items.find(
        (post) => post?.slug === slug,
      );

      return {
        ...posts,
        blogPostCollection: {
          ...posts.blogPostCollection,
          items: item ? [item] : [],
        },
      } as PostBySlugQuery;
    }

    const post = await request(postBySlugQuery, { slug, locale });

    return post as PostBySlugQuery;
  }

  async findAll(locale?: string) {
    if (building) {
      const posts = await this.getCachedAllPosts({ locale });

      return {
        ...posts,
        blogPostCollection: {
          items: posts.blogPostCollection.items.map((post) =>
            post
              ? {
                  __typename: post.__typename,
                  title: post.title,
                  slug: post.slug,
                  about: post.about,
                  createdAt: post.createdAt,
                }
              : null,
          ),
        },
      } as AllPostsQuery;
    }

    const post = await request(allPostsQuery, { locale });

    return post as AllPostsQuery;
  }

  async getAllPreview() {
    const posts = await request(PreviewPosts, {}, { preview: true });

    return posts as PreviewPostsQuery;
  }

  async getPreview(id: string) {
    const post = await request(previewPost, { id }, { preview: true });

    return post as PreviewPostQuery;
  }
}
