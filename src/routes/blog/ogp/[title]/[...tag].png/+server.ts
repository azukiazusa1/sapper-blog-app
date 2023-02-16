import { generateOgpImage } from '$lib/server/generateOgpImage'
import type { RequestHandler } from '@sveltejs/kit'
export const prerender = true

export const GET: RequestHandler = async ({ params }) => {
  const { title, tag = '' } = params
  const tags = tag.split('/')
  const png = await generateOgpImage(title, tags)

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
    },
  })
}
