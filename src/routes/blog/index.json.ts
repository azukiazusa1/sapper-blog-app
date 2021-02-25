import type { ServerResponse } from 'http'
import type { Request } from 'polka'
import { PER_PAGE } from '../../constants'
import RepositoryFactory, { POST } from '../../repositories/RepositoryFactory'
const PostRepository = RepositoryFactory[POST]

export async function get(req: Request, res: ServerResponse) {
  const limit = req.query.limit ? Number(req.query.limit) : PER_PAGE
  const skip = req.query.limit ? Number(req.query.skip) : 0  
  const posts = await PostRepository.get({ limit, skip })
  res.end(JSON.stringify({ posts }))
}