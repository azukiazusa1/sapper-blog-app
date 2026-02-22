import type { PageServerLoad } from "./$types";
import { useRepositories } from "../../../../repositories/useRepositories";
import { markdownToHtml } from "$lib/server/markdownToHtml";

const { short: shortRepo } = useRepositories();

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  const { short } = await shortRepo.findById(id);

  const inputs = [
    short.content1,
    short.content2,
    short.content3,
    short.content4,
  ];
  const contents = (
    await Promise.all(inputs.map((input) => markdownToHtml(input)))
  )
    .map((result) => result.html)
    .filter((content) => content !== "");

  const allShorts = await shortRepo.getAll();
  const allShortsIds = allShorts.shortCollection.items.map(
    (short) => short.sys.id,
  );

  return { short, contents, allShortsIds };
};
