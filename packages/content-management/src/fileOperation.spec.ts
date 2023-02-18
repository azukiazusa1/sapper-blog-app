import { createBlogFile } from './fileOperation.js'
import { vi, describe, test, expect, afterEach, MockedFunction } from 'vitest'
import { promises as fs } from 'fs'
import type { DraftBlogPost, PublishedBlogPost } from './types.js'

const mockedWriteFile = fs.writeFile as MockedFunction<typeof fs.writeFile>

vi.mock('fs', () => {
  return {
    promises: {
      writeFile: vi.fn(),
    },
  }
})

vi.mock('url', () => ({
  fileURLToPath: () => '/path/to/file',
}))

afterEach(() => {
  mockedWriteFile.mockClear()
})

describe('createBlogFile', () => {
  test('公開済のブログポストをファイルに書き出せる', async () => {
    const blog = {
      id: 'id',
      title: 'title',
      about: 'about',
      article: 'article',
      createdAt: '2023-02-05T00:00+09:00',
      updatedAt: '2023-02-05T00:00+09:00',
      slug: 'slug',
      tags: ['tag1', 'tag2'],
      published: true,
    } satisfies PublishedBlogPost

    await createBlogFile(blog)

    expect(mockedWriteFile).toHaveBeenCalledWith(
      `/contents/blogPost/slug.md`,
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
published: true
---
article
`,
    )
  })

  test('下書きのブログポストをファイルに書き出せる', async () => {
    const blog = {
      id: 'id',
      title: 'title',
      about: 'about',
      article: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      slug: undefined,
      tags: [],
      published: false,
    } satisfies DraftBlogPost

    await createBlogFile(blog)

    expect(mockedWriteFile).toHaveBeenCalledWith(
      `/contents/blogPost/id.md`,
      `---
id: id
title: "title"
slug: null
about: "about"
createdAt: null
updatedAt: null
tags: []
published: false
---

`,
    )
  })

  test(`" はエスケープされる`, async () => {
    const blog = {
      id: 'id',
      title: 'title "title"',
      about: 'about "about"',
      article: `article "article"`, // 本文はエスケープしない
      createdAt: '2023-02-05T00:00+09:00',
      updatedAt: '2023-02-05T00:00+09:00',
      slug: `slug-"slug"`,
      tags: [`tag1 "tag1"`, `tag2 "tag2"`],
      published: true,
    } satisfies PublishedBlogPost

    await createBlogFile(blog)

    expect(mockedWriteFile).toHaveBeenCalledWith(
      `/contents/blogPost/slug-"slug".md`,
      `---
id: id
title: "title \\"title\\""
slug: "slug-\\"slug\\""
about: "about \\"about\\""
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1 \\"tag1\\"", "tag2 \\"tag2\\""]
published: true
---
article "article"
`,
    )
  })
})
