import type { PostBySlugQuery, PostsQuery } from "../generated/graphql";

export const createDummyPost = (id = "1") => {
  return {
    __typename: "BlogPost" as const,
    title: `title${id}`,
    slug: id,
    about:
      "木曾路はすべて山の中である。あるところは岨づたいに行く崖の道であり、あるところは数十間の深さに臨む木曾川の岸であり、あるところは山の尾をめぐる谷の入り口である。一筋の街道はこの深い森林地帯を貫いていた。東ざかいの桜沢から、西の十曲峠まで、木曾十一宿はこの街道に添うて、二十二里余にわたる長い谿谷の間に散在していた。道路の位置も幾たびか改まったもので、古道はいつのまにか深い山間に埋もれた。名高い桟も、",
    createdAt: "2021-01-31T15:00:00.000Z",
    tagsCollection: {
      __typename: "BlogPostTagsCollection" as const,
      items: [
        {
          __typename: "Tag" as const,
          name: "tag",
        },
      ],
    },
    thumbnail: {
      __typename: "Asset" as const,
      title: "thumbnail",
      url: "https://picsum.photos/600/400/?random",
    },
  };
};

export const createDummyPosts = (total: number, limit = 12, skip = 0) => {
  const totalItems = [];

  if (totalItems.length === 0) {
    for (let i = 0; i < total; i++) {
      totalItems.push(createDummyPost(String(i)));
    }
  }

  return () => {
    const items = totalItems.slice(skip, skip + limit);
    const dummyPosts: PostsQuery = {
      __typename: "Query",
      blogPostCollection: {
        limit,
        skip,
        total,
        items,
      },
    };
    return dummyPosts;
  };
};

export const createDummyPostBySlugQuery = (slug: string) => {
  return {
    __typename: "Query",
    blogPostCollection: {
      items: [
        {
          title: "title",
          about: "lorem ipsum",
          slug,
          relatedArticleCollection: {
            items: createDummyPosts(4)(),
          },
          article:
            "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo sequi esse asperiores quaerat, est ex? Eaque totam nostrum iure, quod cum dolor asperiores. Deleniti, ab unde? Magni, voluptate velit. Neque!",
          createdAt: "2021-01-31T15:00:00.000Z",
          tagsCollection: {
            __typename: "BlogPostTagsCollection",
            items: [
              {
                __typename: "Tag",
                name: "tag1",
              },
            ],
          },
        },
      ],
    },
  } as PostBySlugQuery;
};
