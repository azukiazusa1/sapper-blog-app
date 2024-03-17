import { createBlogFile, loadBlogPost, Result } from "./fileOperation.ts";
import { vi, describe, test, expect, afterEach, MockedFunction } from "vitest";
import { promises as fs } from "fs";
import type { DraftBlogPost, PublishedBlogPost } from "./types.ts";

const mockedWriteFile = fs.writeFile as MockedFunction<typeof fs.writeFile>;
const mockedReadFile = fs.readFile as MockedFunction<typeof fs.readFile>;

vi.mock("fs", () => {
  return {
    promises: {
      writeFile: vi.fn(),
      readFile: vi.fn(),
    },
  };
});

vi.mock("url", () => ({
  fileURLToPath: () => "/path/to/file",
}));

afterEach(() => {
  mockedWriteFile.mockClear();
  mockedReadFile.mockClear();
});

describe("createBlogFile", () => {
  test("公開済のブログポストをファイルに書き出せる", async () => {
    const blog = {
      id: "id",
      title: "title",
      about: "about",
      article: "article",
      createdAt: "2023-02-05T00:00+09:00",
      updatedAt: "2023-02-05T00:00+09:00",
      slug: "slug",
      tags: ["tag1", "tag2"],
      thumbnail: {
        url: "https://images.ctfassets.net/3",
        title: "title",
      },
      published: true,
    } satisfies PublishedBlogPost;

    await createBlogFile(blog);

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
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
selfAssessment: null
published: true
---
article\n`,
    );
  });

  test("下書きのブログポストをファイルに書き出せる", async () => {
    const blog = {
      id: "id",
      title: "title",
      about: "about",
      article: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      slug: undefined,
      tags: [],
      thumbnail: undefined,
      published: false,
    } satisfies DraftBlogPost;

    await createBlogFile(blog);

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
thumbnail: null
selfAssessment: null
published: false
---
`,
    );
  });

  test(`" はエスケープされる`, async () => {
    const blog = {
      id: "id",
      title: 'title "title"',
      about: 'about "about"',
      article: `article "article"`, // 本文はエスケープしない
      createdAt: "2023-02-05T00:00+09:00",
      updatedAt: "2023-02-05T00:00+09:00",
      slug: `slug-"slug"`,
      tags: [`tag1 "tag1"`, `tag2 "tag2"`],
      thumbnail: {
        url: `https://images.ctfassets.net/"3"`,
        title: `ti"tle`,
      },
      selfAssessment: {
        quizzes: [
          {
            question: `question "question"`,
            answers: [
              {
                text: `answer "answer"`,
                correct: true,
                explanation: `explanation "explanation"`,
              },
              {
                text: "answer2",
                correct: false,
                explanation: "explanation2",
              },
            ],
          },
        ],
      },
      published: true,
    } satisfies PublishedBlogPost;

    await createBlogFile(blog);

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
thumbnail:
  url: "https://images.ctfassets.net/\\"3\\""
  title: "ti\\"tle"
selfAssessment:
  quizzes:
    - question: "question \\"question\\""
      answers:
        - text: "answer \\"answer\\""
          correct: true
          explanation: "explanation \\"explanation\\""
        - text: "answer2"
          correct: false
          explanation: "explanation2"
published: true
---
article "article"\n`,
    );
  });
});

describe("loadBlogPost", () => {
  test("ファイル名からファイルを取得して BlogPost の形式で取得する", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article\n`,
    );

    const result = await loadBlogPost("slug");
    expect(mockedReadFile).toHaveBeenCalledWith(
      `/contents/blogPost/slug.md`,
      "utf-8",
    );
    expect(result).toEqual<Result>({
      success: true,
      data: {
        id: "id",
        title: "title",
        about: "about",
        article: "article",
        createdAt: "2023-02-05T00:00+09:00",
        updatedAt: "2023-02-05T00:00+09:00",
        slug: "slug",
        tags: ["tag1", "tag2"],
        thumbnail: {
          url: "https://images.ctfassets.net/3",
          title: "title",
        },
        published: true,
      },
    });
  });

  test("下書きのファイルを取得してブログポストの形式で取得する", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: null
slug: null
about: null
createdAt: null
updatedAt: null
tags: []
thumbnail: null
published: false
---
`,
    );
    const result = await loadBlogPost("id");
    expect(result).toEqual<Result>({
      success: true,
      data: {
        id: "id",
        title: undefined,
        about: undefined,
        article: "",
        createdAt: undefined,
        updatedAt: undefined,
        slug: undefined,
        tags: [],
        thumbnail: undefined,
        published: false,
      },
    });
  });

  describe("title", () => {
    test("string でなければならない", async () => {
      mockedReadFile.mockResolvedValueOnce(
        `---
id: id
title: 1
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
      );

      const result = await loadBlogPost("id");
      expect(result).toEqual({
        success: false,
        error: [
          expect.objectContaining({
            path: ["title"],
            message: "Expected string, received number",
          }),
        ],
      });
    });

    test("256 文字以上だとバリデーションエラー", async () => {
      mockedReadFile.mockResolvedValueOnce(
        `---
id: id
title: ${"a".repeat(256)}
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
      );

      const result = await loadBlogPost("id");

      expect(result).toEqual({
        success: false,
        error: [
          expect.objectContaining({
            path: ["title"],
            message: "String must contain at most 255 character(s)",
          }),
        ],
      });
    });
  });

  test("255 文字ならバリデーションエラーにならない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: ${"a".repeat(255)}
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result.success).toBe(true);
  });

  test("公開済みの場合 null だとバリデーションエラー", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: null
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["title"],
          message: "Required",
        }),
      ],
    });
  });

  describe("about", () => {
    test("string でなければならない", async () => {
      mockedReadFile.mockResolvedValueOnce(
        `---
id: id
title: "title"
slug: "slug"
about: 1
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
      );

      const result = await loadBlogPost("id");

      expect(result).toEqual({
        success: false,
        error: [
          expect.objectContaining({
            path: ["about"],
            message: "Expected string, received number",
          }),
        ],
      });
    });

    test("256 文字以上だとバリデーションエラー", async () => {
      mockedReadFile.mockResolvedValueOnce(
        `---
id: id
title: "title"
slug: "slug"
about: ${"a".repeat(256)}
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
      );

      const result = await loadBlogPost("id");

      expect(result).toEqual({
        success: false,
        error: [
          expect.objectContaining({
            path: ["about"],
            message: "String must contain at most 255 character(s)",
          }),
        ],
      });
    });
  });

  test("255 文字ならバリデーションエラーにならない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: ${"a".repeat(255)}
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result.success).toBe(true);
  });

  test("公開済みの場合 null だとバリデーションエラー", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: null
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["about"],
          message: "Required",
        }),
      ],
    });
  });
});

describe("slug", () => {
  test("string でなければならない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: 1
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["slug"],
          message: "Expected string, received number",
        }),
      ],
    });
  });

  test("256 文字以上だとバリデーションエラー", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: ${"a".repeat(256)}
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["slug"],
          message: "String must contain at most 255 character(s)",
        }),
      ],
    });
  });

  test("255 文字ならバリデーションエラーにならない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: ${"a".repeat(255)}
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result.success).toBe(true);
  });
});

test("slug の形式が正しくないとバリデーションエラー", async () => {
  mockedReadFile.mockResolvedValueOnce(
    `---
id: id
title: "title"
slug: "不適切なスラッグ"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
  );

  const result = await loadBlogPost("id");

  expect(result).toEqual({
    success: false,
    error: [
      expect.objectContaining({
        path: ["slug"],
        message: "Invalid",
      }),
    ],
  });
});

test("公開済みの場合 null だとバリデーションエラー", async () => {
  mockedReadFile.mockResolvedValueOnce(
    `---
id: id
title: "title"
slug: null
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
  );

  const result = await loadBlogPost("id");

  expect(result).toEqual({
    success: false,
    error: [
      expect.objectContaining({
        path: ["slug"],
        message: "Required",
      }),
    ],
  });
});

describe("createdAt", () => {
  test("string でなければならない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: 1
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["createdAt"],
          message: "Expected string, received number",
        }),
      ],
    });
  });
  test("日付の形式でなくてはならない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00:+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["createdAt"],
          message: "Invalid input",
        }),
      ],
    });
  });
});

test("公開済みの場合 null だとバリデーションエラー", async () => {
  mockedReadFile.mockResolvedValueOnce(
    `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: null
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
  );

  const result = await loadBlogPost("id");

  expect(result).toEqual({
    success: false,
    error: [
      expect.objectContaining({
        path: ["createdAt"],
        message: "Required",
      }),
    ],
  });
});

describe("updateedAt", () => {
  test("string でなければならない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: 1
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["updatedAt"],
          message: "Expected string, received number",
        }),
      ],
    });
  });

  test("日付の形式でなくてはならない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00:+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["updatedAt"],
          message: "Invalid input",
        }),
      ],
    });
  });

  test("公開済みの場合 null だとバリデーションエラー", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: null
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["updatedAt"],
          message: "Required",
        }),
      ],
    });
  });
});

describe("tags", () => {
  test("string の配列 でなければならない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: "tag1"
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["tags"],
          message: "Expected array, received string",
        }),
      ],
    });
  });

  test("配列の要素が string でなければならない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: [1]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["tags", 0],
          message: "Expected string, received number",
        }),
      ],
    });
  });

  test("タグ名は 50 文字以内でなければならない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["${"a".repeat(51)}"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["tags", 0],
          message: "String must contain at most 50 character(s)",
        }),
      ],
    });
  });
});

describe("thumbnail", () => {
  test("url filed が必須", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  title: "title"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["thumbnail", "url"],
          message: "Required",
        }),
      ],
    });
  });

  test("url filed は string でなければならない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: 1
  title: "title"
published: true
---
article
  `,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["thumbnail", "url"],
          message: "Expected string, received number",
        }),
      ],
    });
  });

  test("url は URL の形式でなければならない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "hoge"
  title: "title"
published: true
---
article
  `,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["thumbnail", "url"],
          message: "Invalid url",
        }),
      ],
    });
  });

  test("title filed が必須", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["thumbnail", "title"],
          message: "Required",
        }),
      ],
    });
  });

  test("title は文字列", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: 1
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["thumbnail", "title"],
          message: "Expected string, received number",
        }),
      ],
    });
  });

  test("title は 255 文字以内", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "${"a".repeat(256)}"
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["thumbnail", "title"],
          message: "String must contain at most 255 character(s)",
        }),
      ],
    });
  });

  test("公開済みなら thumbnail は必須", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail: null
published: true
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["thumbnail"],
          message: "Required",
        }),
      ],
    });
  });
});

describe("selfAssessment", () => {
  test("quizzes の配列に Answer があるなら取得する", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
selfAssessment:
  quizzes:
    - question: "question"
      answers:
        - text: "answer1"
          correct: true
          explanation: "explanation"
        - text: "answer2"
          correct: false
          explanation: "explanation"
---
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: true,
      data: {
        id: "id",
        title: "title",
        about: "about",
        article: "",
        createdAt: "2023-02-05T00:00+09:00",
        updatedAt: "2023-02-05T00:00+09:00",
        slug: "slug",
        tags: ["tag1", "tag2"],
        thumbnail: {
          url: "https://images.ctfassets.net/3",
          title: "title",
        },
        published: true,
        selfAssessment: {
          quizzes: [
            {
              question: "question",
              answers: [
                {
                  text: "answer1",
                  correct: true,
                  explanation: "explanation",
                },
                {
                  text: "answer2",
                  correct: false,
                  explanation: "explanation",
                },
              ],
            },
          ],
        },
      },
    });
  });

  test("quizzes が配列ではない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
selfAssessment:
  quizzes: "foo"
---
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["selfAssessment", "quizzes"],
          message: "Expected array, received string",
        }),
      ],
    });
  });

  test("Answer に question がない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
selfAssessment:
  quizzes:
    - answers:
        - text: "answer1"
          correct: true
          explanation: "explanation"
        - text: "answer2"
          correct: false
          explanation: "explanation"
---
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["selfAssessment", "quizzes", 0, "question"],
          message: "Required",
        }),
      ],
    });
  });

  test("Answer に correct がない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
selfAssessment:
  quizzes:
    - question: "question"
      answers:
        - text: "answer1"
          explanation: "explanation"
        - text: "answer2"
          correct: false
          explanation: "explanation"
---
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["selfAssessment", "quizzes", 0, "answers", 0, "correct"],
          message: "Required",
        }),
      ],
    });
  });

  test("Answer に explanation がなくても良い", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00" 
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
selfAssessment:
  quizzes:
    - question: "question"
      answers:
        - text: "answer1"
          correct: true
        - text: "answer2"
          correct: false
          explanation: "explanation"
---
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: true,
      data: {
        id: "id",
        title: "title",
        about: "about",
        article: "",
        createdAt: "2023-02-05T00:00+09:00",
        updatedAt: "2023-02-05T00:00+09:00",
        slug: "slug",
        tags: ["tag1", "tag2"],
        thumbnail: {
          url: "https://images.ctfassets.net/3",
          title: "title",
        },
        published: true,
        selfAssessment: {
          quizzes: [
            {
              question: "question",
              answers: [
                {
                  text: "answer1",
                  correct: true,
                },
                {
                  text: "answer2",
                  correct: false,
                  explanation: "explanation",
                },
              ],
            },
          ],
        },
      },
    });
  });
});

describe("published", () => {
  test("boolean でなければならない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: 1
---
article
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["published"],
          message: "Invalid discriminator value. Expected true | false",
        }),
      ],
    });
  });
});

describe("article", () => {
  test("50,000 文字以内でなければならない", async () => {
    mockedReadFile.mockResolvedValueOnce(
      `---
id: id
title: "title"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
${"a".repeat(50001)}
`,
    );

    const result = await loadBlogPost("id");

    expect(result).toEqual({
      success: false,
      error: [
        expect.objectContaining({
          path: ["article"],
          message: "String must contain at most 50000 character(s)",
        }),
      ],
    });
  });
});

test("yaml が不正な場合はバリデーションエラー", async () => {
  mockedReadFile.mockResolvedValueOnce(
    `---
id: id
title: "tit"le"
slug: "slug"
about: "about"
createdAt: "2023-02-05T00:00+09:00"
tags: ["tag1", "tag2"]
thumbnail:
  url: "https://images.ctfassets.net/3"
  title: "title"
published: true
---
article
`,
  );

  const result = await loadBlogPost("id");

  expect(result).toEqual({
    success: false,
    error: expect.any(Error),
  });
});
