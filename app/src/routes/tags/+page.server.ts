import type { PageServerLoad } from "./$types";
import { useRepositories } from "../../repositories/useRepositories";

const { tag } = useRepositories();

export const load: PageServerLoad = async () => {
  const tags = await tag.get();
  tags.tagCollection.items.sort((a, b) => {
    return (
      b.linkedFrom.entryCollection.total - a.linkedFrom.entryCollection.total
    );
  });
  return tags;
};
