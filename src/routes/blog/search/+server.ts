import { json, type RequestHandler } from '@sveltejs/kit'
import RepositoryFactory, { POST } from '../../../repositories/RepositoryFactory'
const PostRepository = RepositoryFactory[POST]

export const GET: RequestHandler = async ({ request }) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q') ?? ''

  const posts = await PostRepository.search({ q })
  return json(posts)
}
