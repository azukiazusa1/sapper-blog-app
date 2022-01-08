import type { RequestHandler } from '@sveltejs/kit'
import RepositoryFactory, { TAG } from '../../repositories/RepositoryFactory'
const TagRepository = RepositoryFactory[TAG]

export const get: RequestHandler = async () => {
  const tags = await TagRepository.get()
  tags.tagCollection.items.sort((a, b) => {
    return b.linkedFrom.entryCollection.total - a.linkedFrom.entryCollection.total
  })
  return {
    body: {
      tags: tags.tagCollection.items,
    }
  }
}