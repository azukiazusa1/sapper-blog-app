import { paginateParams } from "../../../../utils/paginateParams";
import { useRepositories } from "../../../../repositories/useRepositories";
import type { PageServerLoad } from "./$types";
const { post } = useRepositories();

export const load: PageServerLoad = async ({ params }) => {
  const page = Number(params.page);
  const { limit, skip } = paginateParams(page);
  const posts = await post.get({ limit, skip });
  return {
    page,
    posts,
  };
};
