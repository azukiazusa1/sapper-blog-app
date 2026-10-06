import type { PageServerLoad } from "./$types";
import { renderShortThread } from "#lib/server/shorts.js";
import { useRepositories } from "../../../../repositories/useRepositories";

const { short: shortRepo } = useRepositories();

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  const { short } = await shortRepo.findById(id);

  const htmlThreadItems = await renderShortThread(short);

  return { short, htmlThreadItems };
};
