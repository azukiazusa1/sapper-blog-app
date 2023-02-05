import RepositoryFactory, { POST } from '../../../repositories/RepositoryFactory'
const PostRepository = RepositoryFactory[POST]

import type { PageServerLoad } from './$types'
import { error, redirect } from '@sveltejs/kit'
import { markdownToHtml } from '$lib/markdownToHtml'

export const prerender = false
export const ssr = true

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params

  const data = await PostRepository.getPreview(id)
  if (data.blogPostCollection.items.length === 0) {
    throw error(404, 'Not Found')
  }

  // 公開済の場合はリダイレクト
  if (data.blogPostCollection.items[0].sys.firstPublishedAt !== null) {
    throw redirect(301, `/blog/${data.blogPostCollection.items[0].slug}`)
  }

  const input = data.blogPostCollection.items[0].article
  const contents = await markdownToHtml(input)
  return {
    contents,
    post: data.blogPostCollection.items[0],
  }
}
