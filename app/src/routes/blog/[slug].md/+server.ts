import type { RequestHandler } from "@sveltejs/kit";
import RepositoryFactory, {
  POST,
} from "../../../repositories/RepositoryFactory";
const PostRepository = RepositoryFactory[POST];

export const prerender = true;
export const GET: RequestHandler = async ({ params }) => {
  const { slug } = params;
  const post = await PostRepository.find(slug);

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const blogPost = post.blogPostCollection.items[0];
  const body = `# ${blogPost.title}

${blogPost.article}
  `;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
