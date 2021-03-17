import RepositoryFactory, { POST } from '../../repositories/RepositoryFactory'
const PostRepository = RepositoryFactory[POST]

import unified from 'unified'
import visit from "unist-util-visit";
import builder from 'unist-builder'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import remarkGfm from 'remark-gfm'
import remarkfootnotes from 'remark-footnotes'
import remarkCodeTitles from 'remark-code-titles'
import remarkHink from 'remark-hint'
import html from 'rehype-stringify'
import rehypePrism from '@mapbox/rehype-prism'
import rehypeSlug from 'rehype-slug'
import rehypeToc from '@jsdevtools/rehype-toc'
import rehypeAutoLinkHeadings from 'rehype-autolink-headings'
import type { Request } from 'polka'
import type { ServerResponse } from 'http'

const h = (type, attrs = {}, children = []) => {
  return {
    type: 'element',
    tagName: type,
    data: {
      hName: type,
      hProperties: attrs,
      hChildren: children,
    },
    properties: attrs,
    children,
  };
};

const remarkLinkCard = () => tree => {
  visit(tree, 'link', (node => {
    const {children = []}  = node
    if (node.url !== node.children[0].value) return
    
    node.children = [h('div', { className: 'border-2 border-gray-300 dark:border-gray-600'}, [
      {
        type: 'text',
        value: 'a'
      }
    ])]
    console.log(node.children)
  }))
}

export async function get(req: Request, res: ServerResponse, next: () => void) {
  const { slug } = req.params

  const data = await PostRepository.find(slug)
  if (data.blogPostCollection.items.length === 0) {
    res.writeHead(404, {
			'Content-Type': 'application/json'
		})

		res.end(JSON.stringify({
			message: `Not found`
		}))
  }
  const processor = unified()
    .use(markdown)
    .use(remarkLinkCard)
    .use(remarkGfm)
    .use(remarkfootnotes)
    .use(remarkCodeTitles)
    .use(remarkHink)
    .use(remark2rehype)
    .use(rehypePrism, { ignoreMissing: true })
    .use(rehypeSlug)
    .use(rehypeAutoLinkHeadings)
    .use(rehypeToc)
    .use(html)
  const input = `https://zenn.dev/steelydylan/articles/zenn-web-components
  [google](https://google.com)
  `
  const { contents } = await processor.process(input)
  res.end(JSON.stringify({
    post: data.blogPostCollection.items[0],
    contents
  }))
}