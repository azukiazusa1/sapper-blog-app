import { unified } from "unified";
import remarkLinkCard from "remark-link-card";
import remarkVideo from "remark-video";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import rehypeAlert from "rehype-alert";
import remarkContentFulImage from "remark-contentful-image";
import html from "rehype-stringify";
import rehypeCodeTitles from "rehype-code-titles";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutoLinkHeadings from "rehype-autolink-headings";
import { extractToc } from "$lib/utils";

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export const markdownToHtml = async (
  input: string,
): Promise<{ html: string; toc: TocItem[] }> => {
  let processor = unified()
    .use(markdown)
    .use(remarkVideo)
    .use(remarkLinkCard)
    .use(remarkGfm)
    .use(remarkContentFulImage)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(rehypeAlert)
    .use(rehypeCodeTitles)
    .use(rehypePrettyCode, {
      theme: "material-theme-darker",
      bypassInlineCode: true,
      defaultLang: "plaintext",
    })

    .use(rehypeSlug)
    .use(rehypeAutoLinkHeadings);

  processor = processor.use(html, { allowDangerousHtml: true });

  const { value } = await processor.process(input);
  const htmlString = value.toString();
  return { html: htmlString, toc: extractToc(htmlString) };
};
