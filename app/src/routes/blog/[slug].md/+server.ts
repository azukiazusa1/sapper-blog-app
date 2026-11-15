import type { RequestHandler } from "@sveltejs/kit";
import { getLocale } from "$paraglide/runtime";
import { useRepositories } from "../../../repositories/useRepositories";

const { post: postRepo } = useRepositories();

const toContentfulLocale = (locale: string): string | undefined =>
  locale === "en" ? "en-GB" : undefined;

export const prerender = true;
export const GET: RequestHandler = async ({ params }) => {
  const { slug } = params;
  const postData = await postRepo.find(slug, toContentfulLocale(getLocale()));
  const blogPost = postData.blogPostCollection?.items[0];

  if (!blogPost) {
    return new Response("Not found", { status: 404 });
  }

  const body = `# ${blogPost.title}

${blogPost.article}
  `;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
