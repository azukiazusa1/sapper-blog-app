import type { RequestHandler } from "@sveltejs/kit";
import { useRepositories } from "../../../repositories/useRepositories";

const { post: postRepo } = useRepositories();

export const prerender = true;
export const GET: RequestHandler = async ({ params }) => {
  const { slug } = params;
  const postData = await postRepo.find(slug);

  if (!postData) {
    return new Response("Not found", { status: 404 });
  }

  const blogPost = postData.blogPostCollection.items[0];
  const body = `# ${blogPost.title}

${blogPost.article}
  `;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
