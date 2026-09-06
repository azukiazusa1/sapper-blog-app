import type { MetaSysProps, MetaLinkProps } from "contentful-management";
import { z } from "zod";

export const thumbnailSchema = z.object({
  url: z.string().url(),
  title: z.string().max(255),
});

const quizSchema = z.object({
  question: z.string(),
  answers: z.array(
    z.object({
      text: z.string(),
      correct: z.boolean(),
      explanation: z.string().nullish(),
    }),
  ),
});

export type Quiz = z.infer<typeof quizSchema>;

export type Thumbnail = z.infer<typeof thumbnailSchema>;

export const selfAssessmentSchema = z.object({
  quizzes: z.array(quizSchema),
});

export type SelfAssessment = z.infer<typeof selfAssessmentSchema>;

export const isSelfAssessment = (value: unknown): value is SelfAssessment => {
  return selfAssessmentSchema.safeParse(value).success;
};

/**
 * 本文中の Markdown 画像 `![alt](url)` と動画 `!v(url)` の参照先を取り出す
 */
const IMAGE_REFERENCE = /!\[[^\]]*\]\(\s*([^)\s]+)/g;
const VIDEO_REFERENCE = /!v\(\s*([^)\s]+)/g;

/** 既存記事は `//images.ctfassets.net/...` のプロトコル相対 URL も使っている */
const isRemoteImage = (url: string) => /^(?:https?:)?\/\//.test(url);

/** remark-video は new URL() で検証するため、プロトコル相対 URL は再生できない */
const isRemoteVideo = (url: string) => /^https?:\/\//.test(url);

/**
 * アップロードされずに残ったローカルの画像・動画参照を集める。
 *
 * 執筆中の Markdown には Zed が貼り付けた `![](image_1.png)` や、
 * 手で置いた `!v(recording.mov)` のようなローカルパスが入る。
 * 公開時にこれが残ると Contentful 側の本文が壊れるため、
 * published: true の記事でだけ弾く。
 */
const findLocalMediaReferences = (article: string): string[] => {
  const references: string[] = [];

  for (const [, url] of article.matchAll(IMAGE_REFERENCE)) {
    if (url && !isRemoteImage(url)) {
      references.push(url);
    }
  }

  for (const [, url] of article.matchAll(VIDEO_REFERENCE)) {
    if (url && !isRemoteVideo(url)) {
      references.push(url);
    }
  }

  return references;
};

const publishedArticleSchema = z
  .string()
  .max(50000)
  .superRefine((article, ctx) => {
    const references = findLocalMediaReferences(article);

    if (references.length === 0) {
      return;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "アップロードされていないローカルの画像・動画が残っています: " +
        references.join(", ") +
        "。npm run upload:media -w=packages/content-management -- <記事 ID> を実行してください。",
    });
  });

export const BlogPostSchema = z.discriminatedUnion("published", [
  z.object({
    id: z.string(),
    about: z.string().max(255),
    article: publishedArticleSchema,
    createdAt: z
      .string()
      .refine((v) => new Date(v).toString() !== "Invalid Date"),
    updatedAt: z
      .string()
      .refine((v) => new Date(v).toString() !== "Invalid Date"),
    title: z.string().max(255),
    slug: z
      .string()
      .max(255)
      .regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/),
    audio: z.string().max(255).url().optional(),
    tags: z.array(z.string().max(50)),
    thumbnail: thumbnailSchema,
    selfAssessment: selfAssessmentSchema.optional(),
    published: z.literal(true),
  }),
  z.object({
    id: z.string(),
    about: z.string().max(255).optional(),
    article: z.string().max(50000).optional(),
    createdAt: z
      .string()
      .refine((v) => new Date(v).toString() !== "Invalid Date")
      .optional(),
    updatedAt: z
      .string()
      .refine((v) => new Date(v).toString() !== "Invalid Date")
      .optional(),
    title: z.string().max(255).optional(),
    slug: z
      .string()
      .max(255)
      .regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/)
      .optional(),
    audio: z.string().max(255).url().optional(),
    tags: z.array(z.string().max(50)),
    thumbnail: thumbnailSchema.optional(),
    selfAssessment: selfAssessmentSchema.optional(),
    published: z.literal(false),
  }),
]);

export type BlogPost = z.infer<typeof BlogPostSchema>;
export type PublishedBlogPost = Extract<BlogPost, { published?: true }>;
export type DraftBlogPost = Extract<BlogPost, { published?: false }>;

export type Locale = "en-US" | "en-GB";

export type FieldValue<T> = Partial<Record<Locale, T>>;

export type ContentfulBlogPost = {
  metadata: { tags: [] };
  sys: MetaSysProps;
  fields: Partial<{
    about: FieldValue<string>;
    article: FieldValue<string>;
    createdAt: FieldValue<string>;
    updatedAt: FieldValue<string>;
    thumbnail: FieldValue<{ sys: MetaLinkProps }>;
    selfAssessment: FieldValue<unknown>;
    title: FieldValue<string>;
    slug: FieldValue<string>;
    tags: FieldValue<{ sys: MetaLinkProps }[]>;
    audio: FieldValue<string>;
  }>;
};

export type ContentfulTag = {
  metadata: { tags: [] };
  sys: MetaSysProps;
  fields: {
    name: FieldValue<string>;
    slug: FieldValue<string>;
  };
};

export type PopularPost = {
  title: string;
  path: string;
  views: number;
};
