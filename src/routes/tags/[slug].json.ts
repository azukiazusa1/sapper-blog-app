import { json, RequestHandler } from '@sveltejs/kit'
import RepositoryFactory, { TAG } from '../../repositories/RepositoryFactory'
const TagRepository = RepositoryFactory[TAG]

export const get: RequestHandler = async ({ params }) => {
  const { slug } = params

  const tag = await TagRepository.find({ slug })
  if (tag.tagCollection.items.length === 0) {
    return json(
      {
        message: 'Not Found',
      },
      {
        status: 404,
      },
    )
  }

  return json({
    tag,
  })
}
