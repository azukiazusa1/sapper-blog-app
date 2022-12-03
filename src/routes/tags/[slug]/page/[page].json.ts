import type { RequestHandler } from '@sveltejs/kit'
import RepositoryFactory, { TAG } from '../../../../repositories/RepositoryFactory'
import { paginateParams } from '../../../../utils/paginateParams'
const TagRepository = RepositoryFactory[TAG]

export const get: RequestHandler = async ({ params }) => {
  const { slug, page } = params
  const { skip } = paginateParams(Number(page))

  const tag = await TagRepository.find({ slug, skip })
  if (tag.tagCollection.items.length === 0) {
    return {
      status: 404,
      body: {
        message: 'Not Found',
      },
    }
  }

  return {
    body: {
      tag,
    },
  }
}
