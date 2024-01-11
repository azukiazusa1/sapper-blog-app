import { generateShortOgpImage } from "$lib/server/generateOgpImage";
import type { RequestHandler } from "@sveltejs/kit";
export const prerender = false;

export const GET: RequestHandler = async ({ params }) => {
  const { title } = params;
  const png = await generateShortOgpImage(title);

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
