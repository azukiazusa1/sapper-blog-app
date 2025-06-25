import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import RepositoryFactory, {
  TAG,
} from "../../../../../repositories/RepositoryFactory";
import { paginateParams } from "../../../../../utils/paginateParams";
const TagRepository = RepositoryFactory[TAG];

export const load: PageServerLoad = async ({ params }) => {
  const { slug, page } = params;
  const { skip } = paginateParams(Number(page));

  const tag = await TagRepository.find({ slug, skip });
  if (tag.tagCollection.items.length === 0) {
    error(404, "Tag not found");
  }

  return {
    tag,
    page: Number(page),
  };
};