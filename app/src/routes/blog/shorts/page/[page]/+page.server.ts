import type { PageServerLoad } from "./$types";
import { useRepositories } from "../../../../../repositories/useRepositories";
import { paginateParams } from "../../../../../utils/paginateParams";

const { short } = useRepositories();

export const load: PageServerLoad = async ({ params }) => {
  const page = Number(params.page);
  const { limit, skip } = paginateParams(page);
  const shorts = await short.get({
    limit,
    skip,
  });

  return { shorts, page };
};
