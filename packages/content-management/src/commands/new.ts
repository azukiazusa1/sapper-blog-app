import { createBlogFile } from "../fileOperation.ts";
import { nanoid } from "nanoid";
import { now } from "../datetime.ts";
import type { DraftBlogPost } from "../types.ts";

const id = nanoid();

const blogPost: DraftBlogPost = {
  id,
  title: undefined,
  slug: undefined,
  about: undefined,
  article: undefined,
  createdAt: now(),
  updatedAt: now(),
  tags: [],
  thumbnail: {
    url: "",
    title: "",
  },
  selfAssessment: {
    quizzes: [],
  },
  published: false,
};

await createBlogFile(blogPost);
await createBlogFile(blogPost, "en-GB");

console.log(`Created new blog post templates (ja/en): ${id}`);
