import { unified } from "unified";
import remarkLinkCard from "remark-link-card";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import remarkHint from "remark-hint";
import remarkContentFulImage from "remark-contentful-image";
import html from "rehype-stringify";
import rehypeCodeTitles from "rehype-code-titles";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeToc from "@atomictech/rehype-toc";
import rehypeAutoLinkHeadings from "rehype-autolink-headings";

export const markdownToHtml = async (input: string): Promise<string> => {
  const processor = unified()
    .use(markdown)
    .use(remarkLinkCard)
    .use(remarkGfm)
    .use(remarkHint)
    .use(remarkContentFulImage)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(rehypeCodeTitles)
    .use(rehypePrettyCode, {
      theme: "material-darker",
    })
    .use(rehypeSlug)
    .use(rehypeAutoLinkHeadings)
    // 目次のを挿入する要素を設定
    .use(() => (tree) => {
      const toc = {
        type: "element",
        tagName: "div",
        properties: {},
        children: [
          {
            type: "text",
            value: "[toc]",
          },
        ],
      } as any;
      const body = {
        type: "element",
        tagName: "div",
        properties: {
          className: "markdown-body",
        },
        children: [...tree.children],
      } as any;
      tree.children = [toc, body];
    })
    .use(rehypeToc, {
      placeholder: "[toc]",
      customizeTOC(toc) {
        toc.children.unshift({
          type: "element",
          tagName: "h2",
          properties: {
            id: "toc-title",
          },
          children: [
            {
              type: "text",
              value: "目次",
            },
          ],
        });
        toc.properties["aria-labelledby"] = "toc-title";
        return toc;
      },
    })
    .use(html, { allowDangerousHtml: true });

  const { value } = await processor.process(input);
  return value.toString();
};
