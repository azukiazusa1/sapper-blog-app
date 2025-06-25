import type { PageServerLoad } from "./$types";
import RepositoryFactory, { TAG } from "../../repositories/RepositoryFactory";
const TagRepository = RepositoryFactory[TAG];

export const load: PageServerLoad = async () => {
  const tags = await TagRepository.get();
  tags.tagCollection.items.sort((a, b) => {
    return (
      b.linkedFrom.entryCollection.total - a.linkedFrom.entryCollection.total
    );
  });
  return tags;
};