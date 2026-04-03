import type { ShortListSource, ShortSource } from "$lib/shorts";
import { getShortThreadItems } from "$lib/shorts";
import { markdownToHtml } from "./markdownToHtml";

export const renderShortList = async (
  shorts: ShortSource[],
): Promise<ShortListSource[]> =>
  Promise.all(
    shorts.map(async (short) => {
      const htmlThreadItems = (
        await Promise.all(
          getShortThreadItems(short).map(async (input) => {
            const { html } = await markdownToHtml(input);
            return html;
          }),
        )
      ).filter((content) => content !== "");

      return {
        ...short,
        htmlThreadItems,
      };
    }),
  );

export const renderShortThread = async (
  short: ShortSource,
): Promise<string[]> =>
  (
    await Promise.all(
      getShortThreadItems(short).map(async (input) => {
        const { html } = await markdownToHtml(input);
        return html;
      }),
    )
  ).filter((content) => content !== "");
