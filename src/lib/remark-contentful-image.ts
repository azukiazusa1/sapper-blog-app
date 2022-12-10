import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'

const remarkContentfulImage: Plugin = () => {
  return (tree) => {
    visit(tree, 'image', (node: any) => {
      if (node.url && node.url.includes('images.ctfassets.net')) {
        node.url = node.url + '?q=50&fm=webp'
      }
    })
  }
}

export default remarkContentfulImage
