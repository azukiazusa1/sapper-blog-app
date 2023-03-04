import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { createBlogPost, getBlogPosts, updateBlogPost } from './api'
import type { BlogPost, ContentfulBlogPost, ContentfulTag } from './types'
import { createDummyMetaSysProps } from './test-utils'

const contentful = (path: string) => 'https://api.contentful.com/spaces/:space_id/environments/:environment_id' + path
const tags = [
  {
    metadata: { tags: [] },
    sys: createDummyMetaSysProps({ id: 'tag1' }),
    fields: {
      name: {
        'en-US': 'tag1-name',
      },
      slug: {
        'en-US': 'tag1-slug',
      },
    },
  },
  {
    metadata: { tags: [] },
    sys: createDummyMetaSysProps({ id: 'tag2' }),
    fields: {
      name: {
        'en-US': 'tag2-name',
      },
      slug: {
        'en-US': 'tag2-slug',
      },
    },
  },
] satisfies ContentfulTag[]

const server = setupServer(
  rest.get('https://api.contentful.com/spaces/:spaceId', (_, res, ctx) => {
    return res(
      ctx.json({
        sys: {
          type: 'Space',
          id: 'space',
          version: 3,
          organization: {
            sys: {
              type: 'Link',
              linkType: 'Organization',
              id: 'org-id',
            },
          },
          createdAt: '2015-05-18T11:29:46.809Z',
          createdBy: {
            sys: {
              type: 'Link',
              linkType: 'User',
              id: 'user-id',
            },
          },
          updatedAt: '2015-05-18T11:29:46.809Z',
          updatedBy: {
            sys: {
              type: 'Link',
              linkType: 'User',
              id: 'user-id',
            },
          },
        },
        name: 'Contentful Example API',
      }),
    )
  }),
  rest.get(contentful(''), (_, res, ctx) => {
    return res(
      ctx.json({
        sys: {
          type: 'Environment',
          id: 'staging',
          version: 1,
          space: {
            sys: {
              type: 'Link',
              linkType: 'Space',
              id: 'space',
            },
          },
          createdAt: '2015-05-18T11:29:46.809Z',
          createdBy: {
            sys: {
              type: 'Link',
              linkType: 'User',
              id: 'user-id',
            },
          },
          updatedAt: '2015-05-18T11:29:46.809Z',
          updatedBy: {
            sys: {
              type: 'Link',
              linkType: 'User',
              id: 'user-id',
            },
          },
        },
      }),
    )
  }),
  rest.get(contentful('/entries'), (req, res, ctx) => {
    if (req.url.searchParams.get('content_type') === 'tag') {
      return res(
        ctx.json({
          items: tags,
        }),
      )
    } else {
      return res(ctx.status(404))
    }
  }),
  rest.get(contentful('/assets'), (_, res, ctx) => {
    return res(
      ctx.json({
        items: [
          {
            sys: {
              id: 'asset1',
              type: 'Asset',
              version: 1,
            },
            fields: {
              title: {
                'en-US': 'title',
              },
              description: {
                'en-US': 'description',
              },
              file: {
                'en-US': {
                  url: '//images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png',
                  fileName: 'image.png',
                  contentType: 'image/png',
                },
              },
            },
          },
        ],
      }),
    )
  }),
)

beforeAll(() => {
  server.listen()
})

beforeEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

describe('getBlogPosts', () => {
  test('blog post を取得できる', async () => {
    server.use(
      rest.get(contentful('/entries'), (req, res, ctx) => {
        if (req.url.searchParams.get('content_type') === 'tag') {
          return res(
            ctx.json({
              items: tags,
            }),
          )
        }

        return res(
          ctx.json<{ items: ContentfulBlogPost[] }>({
            items: [
              {
                metadata: { tags: [] },
                sys: createDummyMetaSysProps({ id: 'blog1' }),
                fields: {
                  title: {
                    'en-US': 'title',
                  },
                  about: {
                    'en-US': 'about',
                  },
                  createdAt: {
                    'en-US': '2021-01-01',
                  },
                  updatedAt: {
                    'en-US': '2021-01-02',
                  },
                  slug: {
                    'en-US': 'slug',
                  },
                  article: {
                    'en-US': 'article',
                  },
                  thumbnail: {
                    'en-US': {
                      sys: {
                        id: 'asset1',
                        type: 'Link',
                        linkType: 'Asset',
                      },
                    },
                  },
                  tags: {
                    'en-US': [
                      {
                        sys: {
                          id: 'tag1',
                          type: 'Link',
                          linkType: 'Entry',
                        },
                      },
                      {
                        sys: {
                          id: 'tag2',
                          type: 'Link',
                          linkType: 'Entry',
                        },
                      },
                    ],
                  },
                },
              },
              {
                metadata: { tags: [] },
                sys: createDummyMetaSysProps({ id: 'blog2' }),
                fields: {
                  title: {
                    'en-US': 'title',
                  },
                  about: {
                    'en-US': 'about',
                  },
                  createdAt: {
                    'en-US': '2021-01-01',
                  },
                  updatedAt: {
                    'en-US': '2021-01-01',
                  },
                  slug: {
                    'en-US': 'slug',
                  },
                  article: {
                    'en-US': 'article',
                  },
                  thumbnail: {
                    'en-US': {
                      sys: {
                        id: 'asset1',
                        type: 'Link',
                        linkType: 'Asset',
                      },
                    },
                  },
                  tags: {
                    'en-US': [],
                  },
                },
              },
            ],
          }),
        )
      }),
    )

    const result = await getBlogPosts()
    expect(result).toHaveLength(2)

    expect(result[0]).toEqual<BlogPost>({
      id: 'blog1',
      title: 'title',
      about: 'about',
      createdAt: '2021-01-01',
      updatedAt: '2021-01-02',
      slug: 'slug',
      article: 'article',
      published: true,
      thumbnail: {
        title: 'title',
        url: 'https://images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png',
      },
      tags: ['tag1-name', 'tag2-name'],
    })
  })

  test('published が false の場合 optional なフィールドがある', async () => {
    server.use(
      rest.get(contentful('/entries'), (req, res, ctx) => {
        if (req.url.searchParams.get('content_type') === 'tag') {
          return res(
            ctx.json({
              items: tags,
            }),
          )
        }

        return res(
          ctx.json({
            items: [
              {
                metadata: { tags: [] },
                sys: createDummyMetaSysProps({ id: 'blog1', published: false }),
                fields: {},
              },
            ],
          }),
        )
      }),
    )

    const result = await getBlogPosts()
    expect(result[0]).toEqual<BlogPost>({
      id: 'blog1',
      title: undefined,
      about: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      tags: [],
      thumbnail: undefined,
      published: false,
    })
  })
})

describe('createBlogPost', () => {
  vi.mock('./searchRelatedArticles.js', () => {
    return {
      searchRelatedArticles: async () => {
        return [
          {
            type: 'Link',
            linkType: 'Entry',
            id: 'entry-id',
          },
        ]
      },
    }
  })
  test('blog post を作成する', async () => {
    const contentTypeHeader = vi.fn()
    const entryId = vi.fn()
    const body = vi.fn()
    const publish = vi.fn()
    server.use(
      rest.put(contentful('/entries/:entryId'), async (req, res, ctx) => {
        contentTypeHeader(req.headers.get('X-Contentful-Content-Type'))
        entryId(req.params['entryId'])
        body(await req.json())

        return res(
          ctx.status(201),
          ctx.json({
            metadata: { tags: [] },
            sys: createDummyMetaSysProps({ id: 'blog2' }),
            fields: {
              title: {
                'en-US': 'title',
              },
              about: {
                'en-US': 'about',
              },
              createdAt: {
                'en-US': '2021-01-01',
              },
              updatedAt: {
                'en-US': '2021-01-01',
              },
              slug: {
                'en-US': 'slug',
              },
              article: {
                'en-US': 'article',
              },
              thumbnail: {
                'en-US': {
                  sys: {
                    id: 'asset1',
                    type: 'Link',
                    linkType: 'Asset',
                  },
                },
              },
              tags: {
                'en-US': [],
              },
            },
          }),
        )
      }),
      rest.put(contentful('/entries/:entryId/published'), async (req, res, ctx) => {
        publish(req.params['entryId'])

        return res(ctx.status(200))
      }),
    )

    await createBlogPost({
      id: 'id',
      title: 'title',
      about: 'about',
      createdAt: '2021-01-01',
      updatedAt: '2021-01-02',
      slug: 'slug',
      article: 'article',
      published: false,
      thumbnail: {
        title: 'title',
        url: 'https://images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png',
      },
      tags: ['tag1-name', 'tag2-name'],
    })

    expect(contentTypeHeader).toHaveBeenCalledWith('blogPost')
    expect(entryId).toHaveBeenCalledWith('id')
    expect(body).toHaveBeenCalledWith({
      fields: {
        title: {
          'en-US': 'title',
        },
        about: {
          'en-US': 'about',
        },
        createdAt: {
          'en-US': '2021-01-01',
        },
        updatedAt: {
          'en-US': '2021-01-02',
        },
        slug: {
          'en-US': 'slug',
        },
        article: {
          'en-US': 'article',
        },
        thumbnail: {
          'en-US': {
            sys: {
              id: '{assetId}',
              type: 'Link',
              linkType: 'Asset',
            },
          },
        },
        tags: {
          'en-US': [
            {
              sys: {
                id: 'tag1',
                type: 'Link',
                linkType: 'Entry',
              },
            },
            {
              sys: {
                id: 'tag2',
                type: 'Link',
                linkType: 'Entry',
              },
            },
          ],
        },
        relatedArticles: {
          'en-US': [
            {
              type: 'Link',
              linkType: 'Entry',
              id: 'entry-id',
            },
          ],
        },
      },
    })
  })

  test('タグ名は case insensitive で一致する', async () => {
    const body = vi.fn()
    server.use(
      rest.put(contentful('/entries/:entryId'), async (req, res, ctx) => {
        const _body = await req.json()
        body(_body)
        return res(
          ctx.status(201),
          ctx.json({
            metadata: { tags: [] },
            sys: createDummyMetaSysProps({ id: 'blog2' }),
            fields: _body.fields,
          }),
        )
      }),
      rest.put(contentful('/entries/:entryId/published'), async (_, res, ctx) => {
        return res(ctx.status(200))
      }),
    )

    await createBlogPost({
      id: 'id',
      title: 'title',
      about: 'about',
      createdAt: '2021-01-01',
      updatedAt: '2021-01-02',
      slug: 'slug',
      article: 'article',
      published: false,
      thumbnail: {
        title: 'title',
        url: 'https://images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png',
      },
      tags: ['tag1-name', 'TAG2-NAME'],
    })

    expect(body).toHaveBeenCalledWith({
      fields: expect.objectContaining({
        tags: {
          'en-US': [
            {
              sys: {
                id: 'tag1',
                type: 'Link',
                linkType: 'Entry',
              },
            },
            {
              sys: {
                id: 'tag2',
                type: 'Link',
                linkType: 'Entry',
              },
            },
          ],
        },
      }),
    })
  })

  test('タグが存在しない場合は作成する', async () => {
    const blogPostBody = vi.fn()
    const tagBody = vi.fn()
    server.use(
      rest.post(contentful('/entries'), async (req, res, ctx) => {
        const body = await req.json()
        tagBody(body)
        return res(
          ctx.status(201),
          ctx.json({
            metadata: { tags: [] },
            sys: createDummyMetaSysProps({ id: 'tag3', published: false }),
            fields: body.fields,
          }),
        )
      }),
      rest.put(contentful('/entries/:entryId'), async (req, res, ctx) => {
        const _body = await req.json()
        blogPostBody(_body)
        return res(
          ctx.status(201),
          ctx.json({
            metadata: { tags: [] },
            sys: createDummyMetaSysProps({ id: 'blog2' }),
            fields: _body.fields,
          }),
        )
      }),
      rest.put(contentful('/entries/:entryId/published'), async (_, res, ctx) => {
        return res(ctx.status(200))
      }),
    )

    await createBlogPost({
      id: 'id',
      title: 'title',
      about: 'about',
      createdAt: '2021-01-01',
      updatedAt: '2021-01-02',
      slug: 'slug',
      article: 'article',
      published: false,
      thumbnail: {
        title: 'title',
        url: 'https://images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png',
      },
      tags: ['tag1-name', 'This is new tag'],
    })

    expect(tagBody).toHaveBeenCalledWith({
      fields: {
        name: {
          'en-US': 'This is new tag',
        },
        slug: {
          'en-US': 'this-is-new-tag',
        },
      },
    })
    expect(blogPostBody).toHaveBeenCalledWith({
      fields: expect.objectContaining({
        tags: {
          'en-US': [
            {
              sys: {
                id: 'tag1',
                type: 'Link',
                linkType: 'Entry',
              },
            },
            {
              sys: {
                id: 'tag3',
                type: 'Link',
                linkType: 'Entry',
              },
            },
          ],
        },
      }),
    })
  })
})

describe('updateBlogPost', () => {
  vi.mock('./searchRelatedArticles.js', () => {
    return {
      searchRelatedArticles: async () => {
        return [
          {
            type: 'Link',
            linkType: 'Entry',
            id: 'entry-id',
          },
        ]
      },
    }
  })
  test('blog post を更新する', async () => {
    const entryId = vi.fn()
    const body = vi.fn()
    server.use(
      rest.get(contentful('/entries/:entryId'), (req, res, ctx) => {
        return res(
          ctx.json({
            metadata: { tags: [] },
            sys: createDummyMetaSysProps({ id: req.params['entryId'] as string, published: false }),
            fields: {},
          }),
        )
      }),
      rest.put(contentful('/entries/:entryId'), async (req, res, ctx) => {
        entryId(req.params['entryId'])

        const _body = await req.json()
        body(_body)
        return res(
          ctx.status(200),
          ctx.json({
            metadata: { tags: [] },
            sys: createDummyMetaSysProps({ id: req.params['entryId'] as string, published: false }),
            fields: _body,
          }),
        )
      }),
    )

    await updateBlogPost({
      id: 'blog1',
      title: 'title',
      about: 'about',
      createdAt: '2021-01-01',
      updatedAt: '2021-01-02',
      slug: 'slug',
      article: 'article',
      published: false,
      thumbnail: {
        title: 'title',
        url: 'https://images.ctfassets.net/{spaceId}/{assetId}/{token}/image.png',
      },
      tags: ['tag1-name', 'tag2-name'],
    })

    expect(entryId).toHaveBeenCalledWith('blog1')
    expect(body).toHaveBeenCalledWith({
      fields: {
        title: {
          'en-US': 'title',
        },
        about: {
          'en-US': 'about',
        },
        createdAt: {
          'en-US': '2021-01-01',
        },
        updatedAt: {
          'en-US': '2021-01-02',
        },
        slug: {
          'en-US': 'slug',
        },
        article: {
          'en-US': 'article',
        },
        thumbnail: {
          'en-US': {
            sys: {
              id: '{assetId}',
              type: 'Link',
              linkType: 'Asset',
            },
          },
        },
        tags: {
          'en-US': [
            {
              sys: {
                id: 'tag1',
                type: 'Link',
                linkType: 'Entry',
              },
            },
            {
              sys: {
                id: 'tag2',
                type: 'Link',
                linkType: 'Entry',
              },
            },
          ],
        },
        relatedArticles: {
          'en-US': [
            {
              type: 'Link',
              linkType: 'Entry',
              id: 'entry-id',
            },
          ],
        },
      },
      metadata: {
        tags: [],
      },
    })
  })
})
