import type { PageServerLoad } from "./$types";
import RepositoryFactory, {
  POST,
  SHORT,
} from "../../../repositories/RepositoryFactory";
const PostRepository = RepositoryFactory[POST];
const ShortRepository = RepositoryFactory[SHORT];

export const load: PageServerLoad = async () => {
  const promises = [PostRepository.get({}), ShortRepository.get({})] as const;

  const [posts, shorts] = await Promise.all(promises);
  return { posts, shorts };
};
