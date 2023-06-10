import { paginateParams } from "../../../../utils/paginateParams";
import RepositoryFactory, {
  POST,
} from "../../../../repositories/RepositoryFactory";
import type { PageServerLoad } from "./$types";
const PostRepository = RepositoryFactory[POST];

export const load: PageServerLoad = async ({ params }) => {
  const page = Number(params.page);
  const { limit, skip } = paginateParams(page);
  const posts = await PostRepository.get({ limit, skip });
  return {
    page,
    posts,
  };
};
