import { defineConfig } from 'astro/config'
// https://astro.build/config
import tailwind from '@astrojs/tailwind'
import * as Shiki from 'shiki'

let highlighter
if (!highlighter) {
  highlighter = await Shiki.getHighlighter({
    theme: 'material-default',
  })
}

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [tailwind()],
  markdown: {
    shikiConfig: {
      theme: 'nord',
    },
    remarkPlugins: [
      'remark-parse',
      'remark-link-card',
      'remark-gfm',
      'remark-hint',
      'remark-contentful-image',
      'remark-rehype',
    ],
    rehypePlugins: [
      'rehype-stringify',
      'rehype-code-titles',
      [
        '@leafac/rehype-shiki',
        {
          highlighter,
        },
      ],
      'rehype-slug',
      '@jsdevtools/rehype-toc',
      'rehype-autolink-headings',
    ],
  },
})
