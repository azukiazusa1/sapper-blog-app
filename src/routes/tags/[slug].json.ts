import type { ServerResponse } from "http"
import type { Request } from 'polka'
import RepositoryFactory, { TAG } from '../../repositories/RepositoryFactory'
const TagRepository = RepositoryFactory[TAG]

export async function get(req: Request, res: ServerResponse) {
  const { slug } = req.params
  const skip = req.query.skip ? Number(req.query.skip) : 0  

  const tag = await TagRepository.find({ slug, skip })
  if (tag.tagCollection.items.length === 0) {
    res.writeHead(404, {
			'Content-Type': 'application/json'
		})

		res.end(JSON.stringify({
			message: `Not found`
		}))
  }

  res.end(JSON.stringify({ tag }))
}
