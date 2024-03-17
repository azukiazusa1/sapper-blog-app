import { createBlogFile } from "../fileOperation.ts";
import { nanoid } from "nanoid";
import { now } from "../datetime.ts";

const id = nanoid();

await createBlogFile({
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
});

console.log(`Created new blog post: ${id}`);
