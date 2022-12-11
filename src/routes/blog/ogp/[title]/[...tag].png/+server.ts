import { loadGoogleFont } from '$lib/loadGoogleFont'
import satori from 'satori'
import type { RequestHandler } from '@sveltejs/kit'
import sharp from 'sharp'
export const prerender = true

export const GET: RequestHandler = async ({ params }) => {
  const { title, tag = '' } = params
  const tags = tag.split('/')
  const svg = await satori(
    {
      type: 'div',
      props: {
        children: [
          {
            type: 'div',
            props: {
              children: [
                {
                  type: 'div',
                  props: {
                    children: title,
                    style: { color: '#fff', fontSize: 64, maxWidth: 1000 },
                  },
                },
                {
                  type: 'div',
                  props: {
                    children: tags.map((tag) => ({
                      type: 'div',
                      props: {
                        children: tag,
                        style: {
                          color: '#fff',
                          fontSize: 24,
                          backgroundColor: 'rgb(107,114,128)',
                          padding: '12px 24px',
                          borderRadius: 9999,
                          marginRight: 12,
                        },
                      },
                    })),
                    style: { display: 'flex', alignItems: 'center', maginTop: 12 },
                  },
                },
              ],
              style: {
                display: 'flex',
                flexDirection: 'column',
              },
            },
          },
          {
            type: 'div',
            props: {
              children: [
                {
                  type: 'div',
                  props: {
                    children: [
                      {
                        type: 'img',
                        props: {
                          src: 'https://avatars.githubusercontent.com/u/59350345?s=400&u=9248ba88eab0723c214e002bea66ca1079ef89d8&v=4',
                          style: { borderRadius: 9999, marginRight: 24 },
                          width: 48,
                          height: 48,
                        },
                      },
                      'azukiazusa',
                    ],
                    style: { color: '#d1d5db', fontSize: 48, display: 'flex', alignItems: 'center' },
                  },
                },
              ],
              style: { display: 'flex', justifyContent: 'space-between' },
            },
          },
        ],
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          backgroundColor: 'rgb(55,65,81)',
          fontWeight: 600,
          padding: 48,
          border: '48px solid rgb(31,41,55)',
        },
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans JP',
          data: await loadGoogleFont({ family: 'Noto Sans JP', weight: 400 }),
          style: 'normal',
        },
      ],
    },
  )

  const png = await sharp(Buffer.from(svg)).png().toBuffer()

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
    },
  })
}
