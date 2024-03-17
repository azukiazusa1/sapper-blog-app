import type { MetaSysProps, MetaLinkProps } from "contentful-management";
import { z } from "zod";

export const thumbnailSchema = z.object({
  url: z.string().url(),
  title: z.string().max(255),
});

const quizSchema = z.object({
  text: z.string(),
  correct: z.boolean(),
  explanation: z.string().optional(),
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

export const BlogPostSchema = z.discriminatedUnion("published", [
  z.object({
    id: z.string(),
    about: z.string().max(255),
    article: z.string().max(50000),
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
    tags: z.array(z.string().max(50)),
    thumbnail: thumbnailSchema.optional(),
    selfAssessment: selfAssessmentSchema.optional(),
    published: z.literal(false),
  }),
]);

export type BlogPost = z.infer<typeof BlogPostSchema>;
export type PublishedBlogPost = Extract<BlogPost, { published?: true }>;
export type DraftBlogPost = Extract<BlogPost, { published?: false }>;

export type FieldValue<T> = {
  "en-US": T;
};

export type ContentfulBlogPost = {
  metadata: { tags: [] };
  sys: MetaSysProps;
  fields: {
    about: FieldValue<string>;
    article: FieldValue<string>;
    createdAt: FieldValue<string>;
    updatedAt: FieldValue<string>;
    thumbnail: FieldValue<{ sys: MetaLinkProps }>;
    selfAssessment: FieldValue<unknown>;
    title: FieldValue<string>;
    slug: FieldValue<string>;
    tags: FieldValue<{ sys: MetaLinkProps }[]>;
  };
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
