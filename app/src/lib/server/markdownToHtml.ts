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

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export function extractToc(htmlString: string): TocItem[] {
  const toc: TocItem[] = [];
  const headingRegex = /<(h[2-4])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g;
  let match;
  while ((match = headingRegex.exec(htmlString)) !== null) {
    const level = parseInt(match[1].charAt(1), 10);
    const id = match[2];
    // タグを除去してテキストだけ抽出
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    toc.push({ id, text, level });
  }
  return toc;
}

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
