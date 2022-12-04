import { json, RequestHandler } from '@sveltejs/kit'
import RepositoryFactory, { POST } from '../repositories/RepositoryFactory'
const PostRepository = RepositoryFactory[POST]

export const get: RequestHandler = async () => {
  const posts = await PostRepository.get({
    limit: 3,
  })
  return json({
    posts,
  })
}
