import { json, RequestHandler } from '@sveltejs/kit'
import RepositoryFactory, { TAG } from '../../../../repositories/RepositoryFactory'
import { paginateParams } from '../../../../utils/paginateParams'
const TagRepository = RepositoryFactory[TAG]

export const get: RequestHandler = async ({ params }) => {
  const { slug, page } = params
  const { skip } = paginateParams(Number(page))

  const tag = await TagRepository.find({ slug, skip })
  if (tag.tagCollection.items.length === 0) {
    return json({ message: 'Not Found' }, { status: 404 })
  }

  return json({
    tag,
  })
}
