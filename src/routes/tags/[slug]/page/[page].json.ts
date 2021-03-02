import type { ServerResponse } from "http"
import type { Request } from 'polka'
import RepositoryFactory, { TAG } from '../../../../repositories/RepositoryFactory'
import { paginateParams } from "../../../../utils/paginateParams"
const TagRepository = RepositoryFactory[TAG]

export async function get(req: Request, res: ServerResponse) {
  const { slug, page } = req.params
  const { skip } = paginateParams(Number(page))

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
