import type { PageServerLoad } from './$types'
import RepositoryFactory, { POST } from '../../repositories/RepositoryFactory'
const PostRepository = RepositoryFactory[POST]

export const prerender = false

export const load: PageServerLoad = async () => {
  try {
    const posts = await PostRepository.getAllPreview()

    return posts
  } catch (e) {
    console.error(e)
    return { status: 500 }
  }
}
