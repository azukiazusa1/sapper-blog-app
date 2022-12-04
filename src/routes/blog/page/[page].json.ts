import { json, RequestHandler } from '@sveltejs/kit'
import { paginateParams } from '../../../utils/paginateParams'
import RepositoryFactory, { POST } from '../../../repositories/RepositoryFactory'
const PostRepository = RepositoryFactory[POST]

export const get: RequestHandler = async ({ params }) => {
  const page = Number(params.page)
  const { limit, skip } = paginateParams(page)
  const posts = await PostRepository.get({ limit, skip })
  return json({
    posts,
  })
}
