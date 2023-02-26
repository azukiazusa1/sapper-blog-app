import { visit } from 'unist-util-visit'
import client from 'open-graph-scraper'
import type { Plugin } from 'unified'
import sanitizeHtml from 'sanitize-html'

interface OgImage {
  url?: string
  width?: string
  height?: string
  type?: string
}

interface Result {
  ogTitle?: string
  ogType?: string
  ogUrl?: string
  ogDescription?: string
  ogImage?: OgImage
  requestUrl?: string
  success?: boolean
}

/**
 * 指定したURLのfaviconのURLを返す
 * @param url
 */
const faviconImageSrc = async (url: URL) => {
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=14`

  // favicon が存在するか確認する
  const res = await fetch(faviconUrl, { method: 'HEAD' })
  if (!res.ok) return ''

  return faviconUrl
}

const h = (type: string, attrs = {}, children: any[] = []) => {
  return {
    type: 'element',
    tagName: type,
    data: {
      hName: type,
      hProperties: attrs,
      hChildren: children,
    },
    properties: attrs,
    children,
  }
}

const text = (value = '') => {
  const sanitized = sanitizeHtml(value)

  return {
    type: 'text',
    value: sanitized,
  }
}

const remarkLinkCard: Plugin = () => async (tree) => {
  const transfroms: Promise<void>[] = []
  visit(tree, 'link', (node: any, index, parent) => {
    // リンクだけの行の場合はリンクカードを表示する
    if (parent.children.length > 1 || node.url !== node.children[0].value) return

    transfroms.push(
      client({ url: node.url })
        .then(async ({ error, result }) => {
          if (error) return

          const r = result as Result
          const url = new URL(node.url)

          let imageUrl = ''

          try {
            imageUrl = new URL(r.ogImage?.url ?? '').toString()
          } catch (e) {
            imageUrl = ''
          }

          const faviconUrl = await faviconImageSrc(url)

          node.children = [
            h('div', { className: 'link-card__wrapper' }, [
              h('a', { className: 'link-card', href: url.toString(), rel: 'noreferrer noopener', target: '_blank' }, [
                h('div', { className: 'link-card__main' }, [
                  h('div', { className: 'link-card__content' }, [
                    h('div', { className: 'link-card__title' }, [text(r.ogTitle)]),
                    h('div', { className: 'link-card__description' }, [text(r.ogDescription)]),
                  ]),
                  h('div', { className: 'link-card__meta' }, [
                    faviconUrl
                      ? h('img', { className: 'link-card__favicon', src: faviconUrl, width: 14, height: 14, alt: '' })
                      : h('div'),
                    h('span', { className: 'link-card__url' }, [text(url.hostname)]),
                  ]),
                ]),
                imageUrl
                  ? h('div', { className: 'link-card__thumbnail' }, [
                      h('img', { src: imageUrl, className: 'link-card__image', alt: '' }),
                    ])
                  : h('div'),
              ]),
            ]),
          ]
          parent.children.splice(index, 1, ...node.children)
        })
        .catch(() => {
          // noop
        }),
    )
  })
  await Promise.all(transfroms)
}

export default remarkLinkCard
