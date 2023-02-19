import type { PageServerLoad } from './$types'
import RepositoryFactory, { POST } from '../../repositories/RepositoryFactory'
import type { Config } from '@sveltejs/adapter-vercel'
const PostRepository = RepositoryFactory[POST]

export const prerender = 'auto'
export const config = {
  isr: {
    expiration: 60,
  },
} satisfies Config

export const load: PageServerLoad = async () => {
  const posts = await PostRepository.getAllPreview()

  return posts
}
