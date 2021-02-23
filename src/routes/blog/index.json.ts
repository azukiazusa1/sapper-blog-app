import type { ServerResponse } from 'http'
import type { Request } from 'polka'
import RepositoryFactory, { POST } from '../../repositories/RepositoryFactory'
const PostRepository = RepositoryFactory[POST]

export async function get(req: Request, res: ServerResponse) {
  if ('q' in req.query) {
    const posts = await PostRepository.search({ q: req.query.q as string })
    res.end(JSON.stringify({ posts }))
  } else {
    const posts = await PostRepository.get({})
    res.end(JSON.stringify({ posts }))
  }
}