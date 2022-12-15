import { json, type RequestHandler } from '@sveltejs/kit'
import RepositoryFactory, { POST } from '../../../repositories/RepositoryFactory'
const PostRepository = RepositoryFactory[POST]

export const prerender = false

const paginateParams = (page: number) => {
  const limit = 12
  const skip = (page - 1) * limit
  return { limit, skip }
}

export const GET: RequestHandler = async ({ request }) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q') ?? ''
  const page = Number(url.searchParams.get('page') ?? 1)

  const { limit, skip } = paginateParams(page)

  const posts = await PostRepository.search({ q, limit, skip })
  return json(posts)
}
