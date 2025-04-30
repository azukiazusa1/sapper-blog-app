import contentful, { MetaLinkProps } from "contentful-management";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import slugify from "slugify";
import { Env } from "./env.ts";
import { searchRelatedArticles } from "./searchRelatedArticles.ts";
import {
  isSelfAssessment,
  type BlogPost,
  type ContentfulBlogPost,
  type ContentfulTag,
  type DraftBlogPost,
  type FieldValue,
  type PopularPost,
  type PublishedBlogPost,
  type Thumbnail,
} from "./types";

type Cache = {
  tags?: ContentfulTag[];
  environment?: contentful.Environment;
  assets?: contentful.Asset[];
};

let cache: Cache = {};

const createClient = async () => {
  if (cache.environment) {
    return cache.environment;
  }
  const client = contentful.createClient({
    accessToken: Env.accessToken,
  });

  const space = await client.getSpace(Env.space);
  const environment = await space.getEnvironment(Env.environments);
  cache = {
    ...cache,
    environment,
  };
  return environment;
};

const fetchTags = async (): Promise<ContentfulTag[]> => {
  if (cache.tags) {
    return cache.tags;
  }
  const client = await createClient();

  const tags = await client.getEntries({
    content_type: "tag",
  });

  cache = {
    ...cache,
    tags: tags.items as unknown as ContentfulTag[],
  };

  return tags.items as unknown as ContentfulTag[];
};

const fetchAssets = async (): Promise<contentful.Asset[]> => {
  if (cache.assets) {
    return cache.assets;
  }

  const client = await createClient();

  const assets = await client.getAssets({
    limit: 1000,
  });

  cache = {
    ...cache,
    assets: assets.items,
  };

  return assets.items;
};

const fetchBlogs = async (): Promise<ContentfulBlogPost[]> => {
  const client = await createClient();
  const posts = await client.getEntries({
    content_type: "blogPost",
    limit: 1000,
  });
  return posts.items as unknown as ContentfulBlogPost[];
};

const fetchBlogsByCreatedAt = async ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): Promise<ContentfulBlogPost[]> => {
  const client = await createClient();
  const posts = await client.getEntries({
    content_type: "blogPost",
    limit: 1000,
    "fields.createdAt[gte]": startDate,
    "fields.createdAt[lte]": endDate,
  });
  return posts.items as unknown as ContentfulBlogPost[];
};

const flattenField = <T>(field: FieldValue<T>): T => {
  return field["en-US"];
};

const flattenOptionalField = <T>(
  field: FieldValue<T> | undefined,
): T | undefined => {
  return field ? field["en-US"] : undefined;
};

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
    throw new Error("Invalid asset url" + url);
  }

  return assetId;
};

export const getBlogPosts = async ({
  createdAt,
}: {
  createdAt?: {
    startDate: string;
    endDate: string;
  };
} = {}): Promise<BlogPost[]> => {
  const tags = await fetchTags();
  const blogs =
    createdAt !== undefined
      ? await fetchBlogsByCreatedAt({
          startDate: createdAt.startDate,
          endDate: createdAt.endDate,
        })
      : await fetchBlogs();
  const assets = await fetchAssets();

  const result = await Promise.all(
    blogs.map(async (blog) => {
      let thumbnail: Thumbnail | undefined;
      if (blog.fields.thumbnail) {
        const asset = assets.find(
          (a) => a.sys.id === blog.fields.thumbnail["en-US"].sys.id,
        );
        thumbnail = {
          url: "https:" + asset?.fields.file["en-US"]?.url || "",
          title: asset?.fields.title["en-US"] || "",
        };
      }

      const blogTags: string[] =
        blog.fields.tags?.["en-US"]?.map((tag) => {
          const foundTag = tags.find((t) => t.sys.id === tag.sys.id);
          return foundTag ? flattenField(foundTag.fields.name) : "";
        }) ?? [];

      const maybeSelfAssessment = flattenOptionalField(
        blog.fields.selfAssessment,
      );

      if (contentful.isPublished(blog)) {
        if (thumbnail === undefined)
          throw new Error(
            "公開済みの記事なら thumbnail は必ず存在するはず" + blog.sys.id,
          );

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
          audio: flattenOptionalField(blog.fields.audio),
          selfAssessment: isSelfAssessment(maybeSelfAssessment)
            ? maybeSelfAssessment
            : undefined,
        } satisfies PublishedBlogPost;
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
          audio: flattenOptionalField(blog.fields.audio),
          selfAssessment: isSelfAssessment(maybeSelfAssessment)
            ? maybeSelfAssessment
            : undefined,
        } satisfies DraftBlogPost;
      }
    }),
  );
  return result;
};

const createTag = async (tagName: string): Promise<contentful.Entry> => {
  const client = await createClient();
  const tag = await client.createEntry("tag", {
    fields: {
      name: {
        "en-US": tagName,
      },
      slug: {
        "en-US": slugify(tagName, { lower: true }),
      },
    },
  });
  await tag.publish().catch(() => {
    // テスト時にでなぜかライブラリ側のバグで publish が失敗するので無視する
  });
  return tag;
};

/**
 * タグの名前から Contentful で登録されている ID を取得する
 * case insensitive で比較する
 * 存在しないタグ名があれば新しく作成する
 * @param tagNames タグの名前
 * @returns Contentful の MetaLink の形式
 */
const tagNamesToTagIds = async (
  tagNames: string[],
): Promise<{ sys: MetaLinkProps }[]> => {
  const tags = await fetchTags();
  return Promise.all(
    tagNames.map(async (tagName) => {
      const tag = tags.find(
        (t) =>
          flattenField(t.fields.name).toLowerCase() === tagName.toLowerCase(),
      );
      if (tag) {
        return {
          sys: {
            type: "Link",
            linkType: "Entry",
            id: tag.sys.id,
          },
        };
      } else {
        const result = await createTag(tagName);
        return {
          sys: {
            type: "Link",
            linkType: "Entry",
            id: result.sys.id,
          },
        };
      }
    }),
  );
};

export const createBlogPost = async (blog: BlogPost): Promise<void> => {
  const client = await createClient();
  const entry = await client.createEntryWithId("blogPost", blog.id, {
    fields: {
      title: {
        "en-US": blog.title,
      },
      slug: {
        "en-US": blog.slug,
      },
      about: {
        "en-US": blog.about,
      },
      article: {
        "en-US": blog.article,
      },
      createdAt: {
        "en-US": blog.createdAt,
      },
      updatedAt: {
        "en-US": blog.updatedAt,
      },
      tags: {
        "en-US": await tagNamesToTagIds(blog.tags),
      },
      thumbnail: blog.thumbnail
        ? {
            "en-US": {
              sys: {
                type: "Link",
                linkType: "Asset",
                id: getAssetIdFromUrl(blog.thumbnail.url),
              },
            },
          }
        : undefined,
      audio: blog.audio
        ? {
            "en-US": blog.audio,
          }
        : undefined,
      selfAssessment: blog.selfAssessment
        ? { "en-US": blog.selfAssessment }
        : undefined,
      ["relatedArticle"]: {
        "en-US": await searchRelatedArticles(blog),
      },
    },
  });

  if (blog.published) {
    await entry.publish();
  }
};

export const updateBlogPost = async (blog: BlogPost): Promise<void> => {
  const client = await createClient();
  const entry = await client.getEntry(blog.id);

  const fields = entry.fields;

  if (blog.title) {
    fields["title"] = {
      "en-US": blog.title,
    };
  }
  if (blog.slug) {
    fields["slug"] = {
      "en-US": blog.slug,
    };
  }
  if (blog.about) {
    fields["about"] = {
      "en-US": blog.about,
    };
  }
  if (blog.article) {
    fields["article"] = {
      "en-US": blog.article,
    };
  }
  if (blog.createdAt) {
    fields["createdAt"] = {
      "en-US": blog.createdAt,
    };
  }
  if (blog.updatedAt) {
    fields["updatedAt"] = {
      "en-US": blog.updatedAt,
    };
  }

  fields["tags"] = {
    "en-US": await tagNamesToTagIds(blog.tags),
  };

  fields["relatedArticle"] = {
    "en-US": await searchRelatedArticles(blog),
  };

  if (blog.thumbnail) {
    fields["thumbnail"] = {
      "en-US": {
        sys: {
          type: "Link",
          linkType: "Asset",
          id: getAssetIdFromUrl(blog.thumbnail.url),
        },
      },
    };
  }

  if (blog.audio) {
    fields["audio"] = {
      "en-US": blog.audio,
    };
  }

  if (blog.selfAssessment) {
    fields["selfAssessment"] = {
      "en-US": blog.selfAssessment,
    };
  }

  const updateEntry = await entry.update();

  if (blog.published) {
    await updateEntry.publish();
  }
};

export const deleteBlogPost = async (slugOrId: string): Promise<void> => {
  const client = await createClient();
  const entities = await client.getEntries({
    content_type: "blogPost",
    "fields.slug": slugOrId,
  });

  // slug で検索してもヒットしなかった場合は id で検索する
  const entry = entities.items[0]
    ? entities.items[0]
    : await client.getEntry(slugOrId);

  await entry.delete();
};

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    private_key: Env.privateKey,
    client_email: Env.clientEmail,
  },
});

export const getPopularPosts = async ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): Promise<PopularPost[]> => {
  const response = await analyticsDataClient.runReport({
    property: "properties/" + Env.propertyId,
    dimensions: [
      {
        name: "pagePath",
      },
      {
        name: "pageTitle",
      },
    ],
    metrics: [
      {
        name: "screenPageViews",
      },
    ],
    dateRanges: [
      {
        startDate: startDate,
        endDate: endDate,
      },
    ],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          value: "^/blog/.+$",
          matchType: "FULL_REGEXP",
        },
      },
    },
    limit: 3,
  });

  const rows = response[0].rows ?? [];
  const popularPosts = rows.map((row) => {
    const [path, title] = row.dimensionValues!;
    const [views] = row.metricValues!;
    return {
      title: title?.value || "",
      path: path?.value || "",
      views: Number(views?.value ?? 0),
    };
  });
  return popularPosts;
};
