import { generateShortOgpImage } from "$lib/server/generateOgpImage";
import type { RequestHandler } from "@sveltejs/kit";
import RepositoryFactory, {
  SHORT,
} from "../../../../../repositories/RepositoryFactory";
const ShortRepository = RepositoryFactory[SHORT];
export const prerender = true;

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;
  const { short } = await ShortRepository.findById(id || "");
  const png = await generateShortOgpImage(short?.title || "");

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
