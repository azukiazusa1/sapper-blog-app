import type { PageServerLoad } from "./$types";
import RepositoryFactory, {
  SHORT,
} from "../../../../repositories/RepositoryFactory";
import { markdownToHtml } from "$lib/server/markdownToHtml";
const ShortRepository = RepositoryFactory[SHORT];

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  const { short } = await ShortRepository.findById(id);

  const inputs = [
    short.content1,
    short.content2,
    short.content3,
    short.content4,
  ];
  const contents = (
    await Promise.all(
      inputs.map((input) => markdownToHtml(input, { toc: false })),
    )
  ).filter((content) => content !== "");

  const allShorts = await ShortRepository.getAll();
  const allShortsIds = allShorts.shortCollection.items.map(
    (short) => short.sys.id,
  );

  return { short, contents, allShortsIds };
};
