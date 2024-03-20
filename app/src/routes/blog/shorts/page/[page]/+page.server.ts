import type { PageServerLoad } from "./$types";
import RepositoryFactory, {
  SHORT,
} from "../../../../../repositories/RepositoryFactory";
import { paginateParams } from "../../../../../utils/paginateParams";
const ShortRepository = RepositoryFactory[SHORT];

export const load: PageServerLoad = async ({ params }) => {
  const page = Number(params.page);
  const { limit, skip } = paginateParams(page);
  const shorts = await ShortRepository.get({
    limit,
    skip,
  });

  return { shorts, page };
};
