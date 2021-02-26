import type { ServerResponse } from 'http'
import type { Request } from 'polka'
import RepositoryFactory, { TAG } from '../../repositories/RepositoryFactory'
const TagRepository = RepositoryFactory[TAG]

export async function get(req: Request, res: ServerResponse) {
  const tags = await TagRepository.get()
  tags.tagCollection.items.sort((a, b) => {
    return a.linkedFrom.entryCollection.total - b.linkedFrom.entryCollection.total
  }) 
  res.end(JSON.stringify({ tags }))
}