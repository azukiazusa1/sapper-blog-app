import { unified } from "unified";
import remarkLinkCard from "remark-link-card";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import remarkHint from "remark-hint";
import remarkContentFulImage from "remark-contentful-image";
import html from "rehype-stringify";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeSlug from "rehype-slug";
import rehypeToc from "@jsdevtools/rehype-toc";
import rehypeAutoLinkHeadings from "rehype-autolink-headings";
import rehypeShiki from "@leafac/rehype-shiki";
import * as Shiki from "shiki";

let highlighter: Shiki.Highlighter | undefined;

export const markdownToHtml = async (input: string): Promise<string> => {
  if (!highlighter) {
    highlighter = await Shiki.getHighlighter({
      theme: "material-darker",
    });
  }
  const processor = unified()
    .use(markdown)
    .use(remarkLinkCard)
    .use(remarkGfm)
    .use(remarkHint)
    .use(remarkContentFulImage)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(rehypeCodeTitles)
    .use(rehypeShiki, { highlighter })
    .use(rehypeSlug)
    .use(rehypeAutoLinkHeadings)
    .use(rehypeToc)
    .use(html, { allowDangerousHtml: true });

  const { value } = await processor.process(input);
  return value.toString();
};
