/* eslint-disable @typescript-eslint/ban-ts-comment */
import RepositoryFactory, { POST } from '../../../repositories/RepositoryFactory'
const PostRepository = RepositoryFactory[POST]

import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { markdownToHtml } from '$lib/server/markdownToHtml'

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params

  const data = await PostRepository.find(slug)
  if (data.blogPostCollection.items.length === 0) {
    throw error(404, 'Not Found')
  }
  const input = data.blogPostCollection.items[0].article
  const contents = await markdownToHtml(input)
  return {
    contents,
    post: data.blogPostCollection.items[0],
  }
}
