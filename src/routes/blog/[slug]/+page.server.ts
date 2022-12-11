/* eslint-disable @typescript-eslint/ban-ts-comment */
import RepositoryFactory, { POST } from '../../../repositories/RepositoryFactory'
const PostRepository = RepositoryFactory[POST]

import { unified } from 'unified'
import remarkLinkCard from 'remark-hatena-link-card'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import remarkGfm from 'remark-gfm'
import remarkfootnotes from 'remark-footnotes'
import remarkHint from 'remark-hint'
import remarkContentFulImage from '$lib/remark-contentful-image'
import html from 'rehype-stringify'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypePrism from 'rehype-prism-plus'
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
    .use(markdown)
    .use(remarkLinkCard)
    .use(remarkGfm)
    .use(remarkfootnotes)
    .use(remarkHint)
    .use(remarkContentFulImage)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(rehypeCodeTitles)
    .use(rehypePrism, { ignoreMissing: true, showLineNumbers: true })
    .use(rehypeSlug)
    .use(rehypeAutoLinkHeadings)
    .use(rehypeToc)
    .use(html, { allowDangerousHtml: true })
  const input = data.blogPostCollection.items[0].article
  const { value } = await processor.process(input)
  return {
    contents: value.toString(),
    post: data.blogPostCollection.items[0],
  }
}
