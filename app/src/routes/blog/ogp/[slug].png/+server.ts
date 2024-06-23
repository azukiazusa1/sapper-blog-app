import { generateBlogOgpImage } from "$lib/server/generateOgpImage";
import type { RequestHandler } from "@sveltejs/kit";
import RepositoryFactory, {
  POST,
} from "../../../../repositories/RepositoryFactory";
const PostRepository = RepositoryFactory[POST];
export const prerender = true;

export const GET: RequestHandler = async ({ params }) => {
  const { slug } = params;
  const data = await PostRepository.find(slug);
  const { title, tagsCollection } = data.blogPostCollection.items[0];
  const png = await generateBlogOgpImage(
    title,
    tagsCollection.items.map((tag) => tag.name),
  );

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
