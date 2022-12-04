/* eslint-disable @typescript-eslint/ban-ts-comment */
import RepositoryFactory, { POST } from '../../../repositories/RepositoryFactory'
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
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params

  const data = await PostRepository.find(slug)
  if (data.blogPostCollection.items.length === 0) {
    return error(404, 'Not Found')
  }
  const processor = unified()
    // @ts-expect-error
    .use(markdown)
    .use(remarkLinkCard)
    .use(remarkGfm)
    // @ts-expect-error
    .use(remarkfootnotes)
    .use(remarkHink)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(rehypePrism, { ignoreMissing: true })
    // @ts-expect-error
    .use(rehypeSlug)
    // @ts-expect-error
    .use(rehypeAutoLinkHeadings)
    .use(rehypeToc)
    // @ts-expect-error
    .use(html, { allowDangerousHtml: true })
  const input = data.blogPostCollection.items[0].article
  const { contents } = await processor.process(input)
  return {
    contents: contents.toString(),
    post: data.blogPostCollection.items[0],
  }
}
