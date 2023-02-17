import { promises as fs } from 'fs'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import type { BlogPost } from './types'

const __dirname = dirname(fileURLToPath(import.meta.url))
/**
 * Contentful から取得したブログ記事を yaml front matter 形式でファイルに書き出す
 */
export const createBlogFile = async (blog: BlogPost) => {
  const { title, about, article, createdAt, updatedAt, slug, tags, published } = blog
  const content = `---
title: "${title ? title : 'null'}"
about: "${about ? about : 'null'}"
createdAt: ${createdAt ? `"${createdAt}"` : 'null'}
updatedAt: ${updatedAt ? `"${updatedAt}"` : 'null'}
tags: [${tags.map((t) => `"${t}"`).join(', ')}]
published: ${published}
---
${article ?? ''}
`
  // 下書き記事の場合は slug がない可能性があるので、id をファイル名にする
  const pathName = published ? slug : blog.id

  const outDir = path.join(__dirname, `../../../contents/blogPost/${pathName}.md`)
  await fs.writeFile(outDir, content)
}

/**
 * 下書き → 公開に変更されたブログ記事のファイルを削除する
 */
export const deletePublishedBlogFile = async (blog: BlogPost) => {
  if (!blog.published) {
    return
  }

  const pathName = blog.id
  const dirname = path.join(__dirname, `../../../contents/blogPost/${pathName}.md`)

  // ファイルが存在しない場合は何もしない
  try {
    await fs.access(dirname)
  } catch (e) {
    return
  }

  await fs.unlink(dirname)
}
