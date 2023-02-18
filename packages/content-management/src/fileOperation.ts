import { promises as fs } from 'fs'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import yamlFront from 'yaml-front-matter'
import type { BlogPost } from './types'

const __dirname = dirname(fileURLToPath(import.meta.url))

const excape = (str: string) => {
  return str.replace(/"/g, '\\"')
}

/**
 * Contentful から取得したブログ記事を yaml front matter 形式でファイルに書き出す
 */
export const createBlogFile = async (blog: BlogPost) => {
  const { title, about, article, createdAt, updatedAt, slug, tags, published } = blog
  const content = `---
id: ${blog.id}
title: ${title ? `"${excape(title)}"` : 'null'}
slug: ${slug ? `"${excape(slug)}"` : 'null'}
about: ${about ? `"${excape(about)}"` : 'null'}
createdAt: ${createdAt ? `"${createdAt}"` : 'null'}
updatedAt: ${updatedAt ? `"${updatedAt}"` : 'null'}
tags: [${tags.map((t) => `"${excape(t)}"`).join(', ')}]
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

export const getBlogFile = async (filename: string): Promise<BlogPost> => {
  const dirname = path.join(__dirname, `../../../contents/blogPost/${filename}.md`)
  const content = await fs.readFile(dirname, 'utf-8')
  const blogPost = yamlFront.loadFront(content)

  // TODO: Zod で型チェック
  return {
    id: blogPost['id'] as string,
    title: blogPost['title'] as string,
    about: blogPost['about'] as string,
    article: blogPost.__content,
    createdAt: blogPost['createdAt'] as string,
    updatedAt: blogPost['updatedAt'] as string,
    slug: blogPost['slug'] as string,
    tags: blogPost['tags'] as string[],
    published: blogPost['published'] as boolean,
  } satisfies BlogPost
}
