import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import RepositoryFactory, {
  TAG,
} from "../../../repositories/RepositoryFactory";
const TagRepository = RepositoryFactory[TAG];

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  const tag = await TagRepository.find({ slug });
  if (tag.tagCollection.items.length === 0) {
    error(404, "Tag not found");
  }

  return tag;
};