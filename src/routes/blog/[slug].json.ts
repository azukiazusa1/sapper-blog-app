import RepositoryFactory, { POST } from '../../repositories/RepositoryFactory'
const PostRepository = RepositoryFactory[POST]

import unified from 'unified'
import remarkLinkCard from 'remark-hatena-link-card'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import remarkGfm from 'remark-gfm'
import remarkfootnotes from 'remark-footnotes'
import remarkHink from 'remark-hint'
import html from 'rehype-stringify'
import rehypePrism from '@mapbox/rehype-prism'
import rehypeSlug from 'rehype-slug'
import rehypeToc from '@jsdevtools/rehype-toc'
import rehypeAutoLinkHeadings from 'rehype-autolink-headings'
import type { RequestHandler } from '@sveltejs/kit'

export const get: RequestHandler = async ({ params }) => {
  const { slug } = params

  const data = await PostRepository.find(slug)
  if (data.blogPostCollection.items.length === 0) {
    return {
      status: 404,
      body: {
        message: 'Not Found',
      }
    }
  }
  const processor = unified()
    .use(markdown)
    .use(remarkLinkCard)
    .use(remarkGfm)
    .use(remarkfootnotes)
    .use(remarkHink)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(rehypePrism, { ignoreMissing: true })
    .use(rehypeSlug)
    .use(rehypeAutoLinkHeadings)
    .use(rehypeToc)
    .use(html, { allowDangerousHtml: true })
  const input = data.blogPostCollection.items[0].article
  const { contents } = await processor.process(input)
  return {
    status: 200,
    body: {
      contents: contents.toString(),
      post: data.blogPostCollection.items[0],
    }
  }
}