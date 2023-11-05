import RepositoryFactory, {
  POST,
} from "../../../repositories/RepositoryFactory";
import type { PageServerLoad } from "./$types";
const PostRepository = RepositoryFactory[POST];

export const prerender = false;

const paginateParams = (page: number) => {
  const limit = 12;
  const skip = (page - 1) * limit;
  return { limit, skip };
};

export const load: PageServerLoad = async ({ url }) => {
  const q = url.searchParams.get("q") ?? "";
  const rowPage = Number(url.searchParams.get("page") ?? 1);

  const page = !Number.isNaN(rowPage) && rowPage > 0 ? rowPage : 1;
  const { limit, skip } = paginateParams(page);

  const posts = await PostRepository.search({ q, limit, skip });

  const empty =
    !posts.blogPostCollection || posts.blogPostCollection.items.length === 0;

  return {
    q,
    page,
    posts,
    empty,
  };
};
