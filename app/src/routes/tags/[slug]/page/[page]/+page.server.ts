import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { useRepositories } from "../../../../../repositories/useRepositories";
import { paginateParams } from "../../../../../utils/paginateParams";

const { tag: tagRepo } = useRepositories();

export const load: PageServerLoad = async ({ params }) => {
  const { slug, page } = params;
  const { skip } = paginateParams(Number(page));

  const tag = await tagRepo.find({ slug, skip });
  if (tag.tagCollection.items.length === 0) {
    error(404, "Tag not found");
  }

  return {
    tag,
    page: Number(page),
  };
};
