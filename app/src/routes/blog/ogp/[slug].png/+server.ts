import { generateBlogOgpImage } from "$lib/server/generateOgpImage";
import type { RequestHandler } from "@sveltejs/kit";
import { useRepositories } from "../../../../repositories/useRepositories";

const { post } = useRepositories();
export const prerender = true;

export const GET: RequestHandler = async ({ params }) => {
  const { slug } = params;
  const data = await post.find(slug);
  const { title, tagsCollection } = data.blogPostCollection.items[0];
  const png = await generateBlogOgpImage(
    title,
    tagsCollection.items.map((tag) => tag.name),
  );

  return new Response(Uint8Array.from(png), {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
