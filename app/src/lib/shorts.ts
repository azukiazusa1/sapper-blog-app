import type { Short } from "../generated/graphql";

export type ShortSource = Pick<
  Short,
  "title" | "content1" | "content2" | "content3" | "content4" | "createdAt"
> & {
  sys: { id: string };
};

export type ShortListSource = ShortSource & {
  htmlThreadItems?: string[];
};

export interface ShortListEntry {
  id: string;
  title: string;
  createdAt: string | null;
  htmlThreadItems: string[];
  threadCount: number;
}

export interface ShortDetailEntry {
  id: string;
  title: string;
  createdAt: string | null;
  htmlThreadItems: string[];
}

const normalizeContent = (value?: string | null): string | null => {
  const normalized = value?.trim();
  return normalized ? normalized : null;
};

export const getShortThreadItems = (
  short: Pick<ShortSource, "content1" | "content2" | "content3" | "content4">,
): string[] =>
  [short.content1, short.content2, short.content3, short.content4].flatMap(
    (value) => {
      const normalized = normalizeContent(value);
      return normalized ? [normalized] : [];
    },
  );

const toFallbackHtml = (value: string) => `<p>${value}</p>`;

export const toShortListEntry = (short: ShortListSource): ShortListEntry => {
  const threadItems = getShortThreadItems(short);

  return {
    id: short.sys.id,
    title: short.title,
    createdAt: short.createdAt ?? null,
    htmlThreadItems:
      short.htmlThreadItems?.length === threadItems.length
        ? short.htmlThreadItems
        : threadItems.map(toFallbackHtml),
    threadCount: threadItems.length,
  };
};
