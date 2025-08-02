import type { PageServerLoad } from "./$types";
import { useRepositories } from "../../repositories/useRepositories";

const { post, short } = useRepositories();

export const load: PageServerLoad = async () => {
  const promises = [post.get({}), short.get({})] as const;

  const [posts, shorts] = await Promise.all(promises);
  return { posts, shorts };
};
