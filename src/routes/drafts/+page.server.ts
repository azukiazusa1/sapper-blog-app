import type { PageServerLoad } from './$types'
import RepositoryFactory, { POST } from '../../repositories/RepositoryFactory'
const PostRepository = RepositoryFactory[POST]

export const prerender = false
export const ssr = true

export const load: PageServerLoad = async () => {
  const posts = await PostRepository.getAllPreview()

  return posts
}
