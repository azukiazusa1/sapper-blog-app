import type { RequestHandler } from '@sveltejs/kit'
import RepositoryFactory, { TAG } from '../../repositories/RepositoryFactory'
const TagRepository = RepositoryFactory[TAG]

export const get: RequestHandler = async ({ params }) => {
  const { slug } = params

  const tag = await TagRepository.find({ slug })
  if (tag.tagCollection.items.length === 0) {
    return {
      status: 404,
      body: {
        message: 'Not Found',
      }
    }
  }

  return {
    body: {
      tag
    }
  }
}