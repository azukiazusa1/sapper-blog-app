import { setupServer } from "msw/node";
import { HttpResponse, StrictResponse, http } from "msw";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { createBlogPost, getBlogPosts, updateBlogPost } from "./api.ts";
import type { BlogPost, ContentfulBlogPost, ContentfulTag } from "./types.ts";
import { createDummyMetaSysProps } from "./test-utils.ts";

// Type for test mock Asset objects
type TestAsset = {
  sys: {
    id: string;
    type: "Asset";
    version: number;
  };
  fields: {
    title: {
      "en-US": string;
    };
    description: {
      "en-US": string;
    };
    file: {
      "en-US": {
        url: string;
        fileName: string;
        contentType: string;
      };
    };
  };
};

vi.mock("./searchRelatedArticles", () => {
  return {
    searchRelatedArticles: async () => {
      return [
        {
          sys: {
            type: "Link",
            linkType: "Entry",
            id: "entry-id",
          },
        },
      ];
    },
  };
});
const contentful = (path: string) =>
  "https://api.contentful.com/spaces/:space_id/environments/:environment_id" +
  path;
const tags = [
  {
    metadata: { tags: [] },
    sys: createDummyMetaSysProps({ id: "tag1" }),
    fields: {
      name: {
        "en-US": "tag1-name",
      },
      slug: {
        "en-US": "tag1-slug",
      },
    },
  },
  {
    metadata: { tags: [] },
    sys: createDummyMetaSysProps({ id: "tag2" }),
    fields: {
      name: {
        "en-US": "tag2-name",
      },
      slug: {
        "en-US": "tag2-slug",
      },
    },
  },
] satisfies ContentfulTag[];

const server = setupServer(
  http.get("https://api.contentful.com/spaces/:spaceId", () => {
    return HttpResponse.json({
      sys: {
        type: "Space",
        id: "space",
        version: 3,
        organization: {
          sys: {
            type: "Link",
            linkType: "Organization",
            id: "org-id",
          },
        },
        createdAt: "2015-05-18T11:29:46.809Z",
        createdBy: {
          sys: {
            type: "Link",
            linkType: "User",
            id: "user-id",
          },
        },
        updatedAt: "2015-05-18T11:29:46.809Z",
        updatedBy: {
          sys: {
            type: "Link",
            linkType: "User",
            id: "user-id",
          },
        },
      },
      name: "Contentful Example API",
    });
  }),
  http.get(contentful(""), () => {
    return HttpResponse.json({
      sys: {
        type: "Environment",
        id: "staging",
        version: 1,
        space: {
          sys: {
            type: "Link",
            linkType: "Space",
            id: "space",
          },
        },
        createdAt: "2015-05-18T11:29:46.809Z",
        createdBy: {
          sys: {
            type: "Link",
            linkType: "User",
            id: "user-id",
          },
        },
        updatedAt: "2015-05-18T11:29:46.809Z",
        updatedBy: {
          sys: {
            type: "Link",
            linkType: "User",
            id: "user-id",
          },
        },
      },
    });
  }),
  http.get(contentful("/entries"), ({ request }) => {
    const url = new URL(request.url);
    if (url.searchParams.get("content_type") === "tag") {
      return HttpResponse.json({
        items: tags,
      });
    } else {
      return new Response(undefined, { status: 404 });
    }
  }),
  http.get(contentful("/assets"), () => {
    return HttpResponse.json({
      items: [
        {
          sys: {
            id: "asset1",
            type: "Asset",
            version: 1,
          },
          fields: {
            title: {
              "en-US": "title",
            },
            description: {
              "en-US": "description",
            },
            file: {
              "en-US": {
                url: "//images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png", // cSpell:ignore ctfassets
                fileName: "image.png",
                contentType: "image/png",
              },
            },
          },
        },
      ],
    });
  }),
);

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe("getBlogPosts", () => {
  test("blog post を取得できる", async () => {
    server.use(
      http.get(
        contentful("/entries"),
        ({
          request,
        }): StrictResponse<
          | { items: ContentfulTag[] }
          | { items: ContentfulBlogPost[]; includes?: { Asset?: TestAsset[] } }
        > => {
          const url = new URL(request.url);
          if (url.searchParams.get("content_type") === "tag") {
            return HttpResponse.json({
              items: tags,
            });
          }

          return HttpResponse.json({
            items: [
              {
                metadata: { tags: [] },
                sys: createDummyMetaSysProps({ id: "blog1" }),
                fields: {
                  title: {
                    "en-US": "title",
                  },
                  about: {
                    "en-US": "about",
                  },
                  createdAt: {
                    "en-US": "2021-01-01",
                  },
                  updatedAt: {
                    "en-US": "2021-01-02",
                  },
                  slug: {
                    "en-US": "slug",
                  },
                  article: {
                    "en-US": "article",
                  },
                  thumbnail: {
                    "en-US": {
                      sys: {
                        id: "asset1",
                        type: "Link",
                        linkType: "Asset",
                      },
                    },
                  },
                  audio: {
                    "en-US": "audio",
                  },
                  tags: {
                    "en-US": [
                      {
                        sys: {
                          id: "tag1",
                          type: "Link",
                          linkType: "Entry",
                        },
                      },
                      {
                        sys: {
                          id: "tag2",
                          type: "Link",
                          linkType: "Entry",
                        },
                      },
                    ],
                  },
                  selfAssessment: {
                    "en-US": {},
                  },
                },
              },
              {
                metadata: { tags: [] },
                sys: createDummyMetaSysProps({ id: "blog2" }),
                fields: {
                  title: {
                    "en-US": "title",
                  },
                  about: {
                    "en-US": "about",
                  },
                  createdAt: {
                    "en-US": "2021-01-01",
                  },
                  updatedAt: {
                    "en-US": "2021-01-01",
                  },
                  slug: {
                    "en-US": "slug",
                  },
                  article: {
                    "en-US": "article",
                  },
                  thumbnail: {
                    "en-US": {
                      sys: {
                        id: "asset1",
                        type: "Link",
                        linkType: "Asset",
                      },
                    },
                  },
                  audio: {
                    "en-US": "audio",
                  },
                  tags: {
                    "en-US": [],
                  },
                  selfAssessment: {
                    "en-US": {},
                  },
                },
              },
            ],
            includes: {
              Asset: [
                {
                  sys: {
                    id: "asset1",
                    type: "Asset",
                    version: 1,
                  },
                  fields: {
                    title: {
                      "en-US": "title",
                    },
                    description: {
                      "en-US": "description",
                    },
                    file: {
                      "en-US": {
                        url: "//images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png", // cSpell:ignore ctfassets
                        fileName: "image.png",
                        contentType: "image/png",
                      },
                    },
                  },
                },
              ],
            },
          });
        },
      ),
    );

    const result = await getBlogPosts();
    expect(result).toHaveLength(2);

    expect(result[0]).toEqual<BlogPost>({
      id: "blog1",
      title: "title",
      about: "about",
      createdAt: "2021-01-01",
      updatedAt: "2021-01-02",
      slug: "slug",
      article: "article",
      published: true,
      thumbnail: {
        title: "title",
        url: "https://images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png",
      },
      audio: "audio",
      tags: ["tag1-name", "tag2-name"],
    });
  });

  test("selfAssessment がスキーマに一致している場合取得する", async () => {
    server.use(
      http.get(contentful("/entries"), () => {
        return HttpResponse.json({
          items: [
            {
              metadata: { tags: [] },
              sys: createDummyMetaSysProps({ id: "blog1" }),
              fields: {
                title: {
                  "en-US": "title",
                },
                about: {
                  "en-US": "about",
                },
                createdAt: {
                  "en-US": "2021-01-01",
                },
                updatedAt: {
                  "en-US": "2021-01-02",
                },
                slug: {
                  "en-US": "slug",
                },
                article: {
                  "en-US": "article",
                },
                thumbnail: {
                  "en-US": {
                    sys: {
                      id: "asset1",
                      type: "Link",
                      linkType: "Asset",
                    },
                  },
                },
                tags: {
                  "en-US": [
                    {
                      sys: {
                        id: "tag1",
                        type: "Link",
                        linkType: "Entry",
                      },
                    },
                    {
                      sys: {
                        id: "tag2",
                        type: "Link",
                        linkType: "Entry",
                      },
                    },
                  ],
                },
                selfAssessment: {
                  "en-US": {
                    quizzes: [
                      {
                        question: "question",
                        answers: [
                          {
                            correct: true,
                            text: "text",
                            explanation: "explanation",
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          ],
          includes: {
            Asset: [
              {
                sys: {
                  id: "asset1",
                  type: "Asset",
                  version: 1,
                },
                fields: {
                  title: {
                    "en-US": "title",
                  },
                  description: {
                    "en-US": "description",
                  },
                  file: {
                    "en-US": {
                      url: "//images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png", // cSpell:ignore ctfassets
                      fileName: "image.png",
                      contentType: "image/png",
                    },
                  },
                },
              },
            ],
          },
        });
      }),
    );

    const result = await getBlogPosts();

    return expect(result).toEqual<BlogPost[]>([
      {
        id: "blog1",
        title: "title",
        about: "about",
        createdAt: "2021-01-01",
        updatedAt: "2021-01-02",
        slug: "slug",
        article: "article",
        published: true,
        thumbnail: {
          title: "title",
          url: "https://images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png",
        },
        tags: ["tag1-name", "tag2-name"],
        selfAssessment: {
          quizzes: [
            {
              question: "question",
              answers: [
                {
                  correct: true,
                  text: "text",
                  explanation: "explanation",
                },
              ],
            },
          ],
        },
      },
    ]);
  });

  test("published が false の場合 optional なフィールドがある", async () => {
    server.use(
      http.get(contentful("/entries"), ({ request }) => {
        const url = new URL(request.url);
        if (url.searchParams.get("content_type") === "tag") {
          return HttpResponse.json({
            items: tags,
          });
        }

        return HttpResponse.json({
          items: [
            {
              metadata: { tags: [] },
              sys: createDummyMetaSysProps({ id: "blog1", published: false }),
              fields: {},
            },
          ],
          includes: {
            Asset: [],
          },
        });
      }),
    );

    const result = await getBlogPosts();
    expect(result[0]).toEqual<BlogPost>({
      id: "blog1",
      title: undefined,
      about: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      tags: [],
      thumbnail: undefined,
      published: false,
    });
  });
});

describe("createBlogPost", () => {
  test("blog post を作成する", async () => {
    const contentTypeHeader = vi.fn();
    const entryId = vi.fn();
    const body = vi.fn();
    const publish = vi.fn();
    server.use(
      http.put(contentful("/entries/:entryId"), async ({ request, params }) => {
        contentTypeHeader(request.headers.get("X-Contentful-Content-Type"));
        entryId(params["entryId"]);
        body(await request.json());

        return HttpResponse.json({
          metadata: { tags: [] },
          sys: createDummyMetaSysProps({ id: "blog2" }),
          fields: {
            title: {
              "en-US": "title",
            },
            about: {
              "en-US": "about",
            },
            createdAt: {
              "en-US": "2021-01-01",
            },
            updatedAt: {
              "en-US": "2021-01-01",
            },
            slug: {
              "en-US": "slug",
            },
            article: {
              "en-US": "article",
            },
            thumbnail: {
              "en-US": {
                sys: {
                  id: "asset1",
                  type: "Link",
                  linkType: "Asset",
                },
              },
            },
            tags: {
              "en-US": [],
            },
            selfAssessment: {
              "en-US": {},
            },
          },
        });
      }),
      http.put(
        contentful("/entries/:entryId/published"),
        async ({ params }) => {
          publish(params["entryId"]);

          return new Response(undefined, { status: 200 });
        },
      ),
    );

    await createBlogPost({
      id: "id",
      title: "title",
      about: "about",
      createdAt: "2021-01-01",
      updatedAt: "2021-01-02",
      slug: "slug",
      article: "article",
      published: false,
      thumbnail: {
        title: "title",
        url: "https://images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png",
      },
      tags: ["tag1-name", "tag2-name"],
    });

    expect(contentTypeHeader).toHaveBeenCalledWith("blogPost");
    expect(entryId).toHaveBeenCalledWith("id");
    expect(body).toHaveBeenCalledWith({
      fields: {
        title: {
          "en-US": "title",
        },
        about: {
          "en-US": "about",
        },
        createdAt: {
          "en-US": "2021-01-01",
        },
        updatedAt: {
          "en-US": "2021-01-02",
        },
        slug: {
          "en-US": "slug",
        },
        article: {
          "en-US": "article",
        },
        thumbnail: {
          "en-US": {
            sys: {
              id: "{assetId}",
              type: "Link",
              linkType: "Asset",
            },
          },
        },
        tags: {
          "en-US": [
            {
              sys: {
                id: "tag1",
                type: "Link",
                linkType: "Entry",
              },
            },
            {
              sys: {
                id: "tag2",
                type: "Link",
                linkType: "Entry",
              },
            },
          ],
        },
        relatedArticle: {
          "en-US": [
            {
              sys: {
                type: "Link",
                linkType: "Entry",
                id: "entry-id",
              },
            },
          ],
        },
      },
    });
  });

  test("タグ名は case insensitive で一致する", async () => {
    const body = vi.fn();
    server.use(
      http.put(contentful("/entries/:entryId"), async ({ request }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const _body = (await request.json()) as any;
        body(_body);
        return HttpResponse.json({
          metadata: { tags: [] },
          sys: createDummyMetaSysProps({ id: "blog2" }),
          fields: _body.fields,
        });
      }),
      http.put(contentful("/entries/:entryId/published"), async () => {
        return new Response(undefined, { status: 200 });
      }),
    );

    await createBlogPost({
      id: "id",
      title: "title",
      about: "about",
      createdAt: "2021-01-01",
      updatedAt: "2021-01-02",
      slug: "slug",
      article: "article",
      published: false,
      thumbnail: {
        title: "title",
        url: "https://images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png",
      },
      tags: ["tag1-name", "TAG2-NAME"],
    });

    expect(body).toHaveBeenCalledWith({
      fields: expect.objectContaining({
        tags: {
          "en-US": [
            {
              sys: {
                id: "tag1",
                type: "Link",
                linkType: "Entry",
              },
            },
            {
              sys: {
                id: "tag2",
                type: "Link",
                linkType: "Entry",
              },
            },
          ],
        },
      }),
    });
  });

  test("タグが存在しない場合は作成する", async () => {
    const blogPostBody = vi.fn();
    const tagBody = vi.fn();
    server.use(
      http.post(contentful("/entries"), async ({ request }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body = (await request.json()) as any;
        tagBody(body);
        return HttpResponse.json({
          metadata: { tags: [] },
          sys: createDummyMetaSysProps({ id: "tag3", published: false }),
          fields: body.fields,
        });
      }),
      http.put(contentful("/entries/:entryId"), async ({ request }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const _body = (await request.json()) as any;
        blogPostBody(_body);
        return HttpResponse.json({
          metadata: { tags: [] },
          sys: createDummyMetaSysProps({ id: "blog2" }),
          fields: _body.fields,
        });
      }),
      http.put(contentful("/entries/:entryId/published"), async () => {
        return new Response(undefined, { status: 200 });
      }),
    );

    await createBlogPost({
      id: "id",
      title: "title",
      about: "about",
      createdAt: "2021-01-01",
      updatedAt: "2021-01-02",
      slug: "slug",
      article: "article",
      published: false,
      thumbnail: {
        title: "title",
        url: "https://images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png",
      },
      tags: ["tag1-name", "This is new tag"],
    });

    expect(tagBody).toHaveBeenCalledWith({
      fields: {
        name: {
          "en-US": "This is new tag",
        },
        slug: {
          "en-US": "this-is-new-tag",
        },
      },
    });
    expect(blogPostBody).toHaveBeenCalledWith({
      fields: expect.objectContaining({
        tags: {
          "en-US": [
            {
              sys: {
                id: "tag1",
                type: "Link",
                linkType: "Entry",
              },
            },
            {
              sys: {
                id: "tag3",
                type: "Link",
                linkType: "Entry",
              },
            },
          ],
        },
      }),
    });
  });

  test("selfAssessment がスキーマに一致している場合作成する", async () => {
    const body = vi.fn();
    server.use(
      http.put(contentful("/entries/:entryId"), async ({ request }) => {
        const _body = await request.json();
        body(_body);
        return HttpResponse.json({
          metadata: { tags: [] },
          sys: createDummyMetaSysProps({ id: "blog2" }),
          fields: _body,
        });
      }),
      http.put(contentful("/entries/:entryId/published"), async () => {
        return new Response(undefined, { status: 200 });
      }),
    );

    await createBlogPost({
      id: "id",
      title: "title",
      about: "about",
      createdAt: "2021-01-01",
      updatedAt: "2021-01-02",
      slug: "slug",
      article: "article",
      published: false,
      thumbnail: {
        title: "title",
        url: "https://images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png",
      },
      tags: ["tag1-name", "tag2-name"],
      selfAssessment: {
        quizzes: [
          {
            question: "question",
            answers: [
              {
                correct: true,
                text: "text",
                explanation: "explanation",
              },
            ],
          },
        ],
      },
    });

    expect(body).toHaveBeenCalledWith({
      fields: {
        title: {
          "en-US": "title",
        },
        about: {
          "en-US": "about",
        },
        createdAt: {
          "en-US": "2021-01-01",
        },
        updatedAt: {
          "en-US": "2021-01-02",
        },
        slug: {
          "en-US": "slug",
        },
        article: {
          "en-US": "article",
        },
        thumbnail: {
          "en-US": {
            sys: {
              id: "{assetId}",
              type: "Link",
              linkType: "Asset",
            },
          },
        },
        tags: {
          "en-US": [
            {
              sys: {
                id: "tag1",
                type: "Link",
                linkType: "Entry",
              },
            },
            {
              sys: {
                id: "tag2",
                type: "Link",
                linkType: "Entry",
              },
            },
          ],
        },
        selfAssessment: {
          "en-US": {
            quizzes: [
              {
                question: "question",
                answers: [
                  {
                    correct: true,
                    text: "text",
                    explanation: "explanation",
                  },
                ],
              },
            ],
          },
        },
        relatedArticle: {
          "en-US": [
            {
              sys: {
                type: "Link",
                linkType: "Entry",
                id: "entry-id",
              },
            },
          ],
        },
      },
    });
  });
});

describe("updateBlogPost", () => {
  test("blog post を更新する", async () => {
    const entryId = vi.fn();
    const body = vi.fn();
    server.use(
      http.get(contentful("/entries/:entryId"), ({ params }) => {
        return HttpResponse.json({
          metadata: { tags: [] },
          sys: createDummyMetaSysProps({
            id: params["entryId"] as string,
            published: false,
          }),
          fields: {},
        });
      }),
      http.put(contentful("/entries/:entryId"), async ({ request, params }) => {
        entryId(params["entryId"]);

        const _body = await request.json();
        body(_body);
        return HttpResponse.json({
          metadata: { tags: [] },
          sys: createDummyMetaSysProps({
            id: params["entryId"] as string,
            published: false,
          }),
          fields: _body,
        });
      }),
    );

    await updateBlogPost({
      id: "blog1",
      title: "title",
      about: "about",
      createdAt: "2021-01-01",
      updatedAt: "2021-01-02",
      slug: "slug",
      article: "article",
      published: false,
      thumbnail: {
        title: "title",
        url: "https://images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png",
      },
      tags: ["tag1-name", "tag2-name"],
    });

    expect(entryId).toHaveBeenCalledWith("blog1");
    expect(body).toHaveBeenCalledWith({
      fields: {
        title: {
          "en-US": "title",
        },
        about: {
          "en-US": "about",
        },
        createdAt: {
          "en-US": "2021-01-01",
        },
        updatedAt: {
          "en-US": "2021-01-02",
        },
        slug: {
          "en-US": "slug",
        },
        article: {
          "en-US": "article",
        },
        thumbnail: {
          "en-US": {
            sys: {
              id: "{assetId}",
              type: "Link",
              linkType: "Asset",
            },
          },
        },
        tags: {
          "en-US": [
            {
              sys: {
                id: "tag1",
                type: "Link",
                linkType: "Entry",
              },
            },
            {
              sys: {
                id: "tag2",
                type: "Link",
                linkType: "Entry",
              },
            },
          ],
        },
        relatedArticle: {
          "en-US": [
            {
              sys: {
                type: "Link",
                linkType: "Entry",
                id: "entry-id",
              },
            },
          ],
        },
      },
      metadata: {
        tags: [],
      },
    });
  });

  test("selfAssessment がスキーマに一致している場合更新する", async () => {
    const body = vi.fn();
    server.use(
      http.get(contentful("/entries/:entryId"), ({ params }) => {
        return HttpResponse.json({
          metadata: { tags: [] },
          sys: createDummyMetaSysProps({
            id: params["entryId"] as string,
            published: false,
          }),
          fields: {},
        });
      }),
      http.put(contentful("/entries/:entryId"), async ({ request, params }) => {
        const _body = await request.json();
        body(_body);
        return HttpResponse.json({
          metadata: { tags: [] },
          sys: createDummyMetaSysProps({
            id: params["entryId"] as string,
            published: false,
          }),
          fields: _body,
        });
      }),
    );

    await updateBlogPost({
      id: "blog1",
      title: "title",
      about: "about",
      createdAt: "2021-01-01",
      updatedAt: "2021-01-02",
      slug: "slug",
      article: "article",
      published: false,
      thumbnail: {
        title: "title",
        url: "https://images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png",
      },
      tags: ["tag1-name", "tag2-name"],
      selfAssessment: {
        quizzes: [
          {
            question: "question",
            answers: [
              {
                correct: true,
                text: "text",
                explanation: "explanation",
              },
            ],
          },
        ],
      },
    });

    expect(body).toHaveBeenCalledWith({
      fields: {
        title: {
          "en-US": "title",
        },
        about: {
          "en-US": "about",
        },
        createdAt: {
          "en-US": "2021-01-01",
        },
        updatedAt: {
          "en-US": "2021-01-02",
        },
        slug: {
          "en-US": "slug",
        },
        article: {
          "en-US": "article",
        },
        thumbnail: {
          "en-US": {
            sys: {
              id: "{assetId}",
              type: "Link",
              linkType: "Asset",
            },
          },
        },
        tags: {
          "en-US": [
            {
              sys: {
                id: "tag1",
                type: "Link",
                linkType: "Entry",
              },
            },
            {
              sys: {
                id: "tag2",
                type: "Link",
                linkType: "Entry",
              },
            },
          ],
        },
        relatedArticle: {
          "en-US": [
            {
              sys: {
                type: "Link",
                linkType: "Entry",
                id: "entry-id",
              },
            },
          ],
        },
        selfAssessment: {
          "en-US": {
            quizzes: [
              {
                question: "question",
                answers: [
                  {
                    correct: true,
                    text: "text",
                    explanation: "explanation",
                  },
                ],
              },
            ],
          },
        },
      },
      metadata: {
        tags: [],
      },
    });
  });
});
