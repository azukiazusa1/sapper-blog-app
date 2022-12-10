import type { Handle } from '@sveltejs/kit'
import { minify, type Options } from 'html-minifier'

const minification_options: Options = {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
  decodeEntities: true,
  html5: true,
  ignoreCustomComments: [/^#/],
  minifyCSS: true,
  minifyJS: false,
  removeAttributeQuotes: true,
  removeComments: false, // some hydration code needs comments, so leave them in
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  sortAttributes: true,
  sortClassName: true,
}

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event)

  if (response.headers.get('content-type') === 'text/html') {
    return new Response(minify(await response.text(), minification_options), {
      status: response.status,
      headers: response.headers,
    })
  }

  return response
}
