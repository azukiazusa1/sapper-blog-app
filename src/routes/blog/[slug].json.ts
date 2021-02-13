import RepositoryFactory, { POST } from '../../repositories/RepositoryFactory'
const PostRepository = RepositoryFactory[POST]

import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import html from 'rehype-stringify'
import type { Request } from 'polka'
import type { ServerResponse } from 'http'

export async function get(req: Request, res: ServerResponse, next: () => void) {
  const { slug } = req.params

  const data = await PostRepository.find(slug)
  if (data.blogPostCollection.items.length === 0) {
    res.writeHead(404, {
			'Content-Type': 'application/json'
		})

		res.end(JSON.stringify({
			message: `Not found`
		}))
  }
  const processor = unified()
    .use(markdown)
    .use(remark2rehype)
    .use(html)
  const input = data.blogPostCollection.items[0].article
  const { contents } = await processor.process(input)
  res.end(JSON.stringify({
    post: data.blogPostCollection.items[0],
    contents
  }))
}