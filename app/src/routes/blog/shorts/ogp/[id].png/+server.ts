import { generateShortOgpImage } from "$lib/server/generateOgpImage";
import type { RequestHandler } from "@sveltejs/kit";
import { useRepositories } from "../../../../../repositories/useRepositories";

const { short } = useRepositories();
export const prerender = true;

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;
  const { short: shortData } = await short.findById(id || "");
  const png = await generateShortOgpImage(shortData?.title || "");

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
