import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { useRepositories } from "../../../repositories/useRepositories";

const { tag } = useRepositories();

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  const tagData = await tag.find({ slug });
  if (tagData.tagCollection.items.length === 0) {
    error(404, "Tag not found");
  }

  return tagData;
};
