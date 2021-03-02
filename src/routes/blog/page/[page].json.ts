import type { ServerResponse } from 'http'
import type { Request } from 'polka'
import { paginateParams } from '../../../utils/paginateParams'
import RepositoryFactory, { POST } from '../../../repositories/RepositoryFactory'
const PostRepository = RepositoryFactory[POST]

export async function get(req: Request, res: ServerResponse) {
  const page = Number(req.params.page)
  const { limit, skip } = paginateParams(page)
  const posts = await PostRepository.get({ limit, skip })
  res.end(JSON.stringify({ posts }))
}
