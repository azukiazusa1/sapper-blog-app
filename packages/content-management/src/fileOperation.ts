import { promises as fs } from 'fs'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import yamlFront from 'yaml-front-matter'
import { BlogPost, BlogPostSchema } from './types.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * yaml の文字列の " はエスケープする必要がある
 */
const excape = (str: string) => {
  return str.replace(/"/g, '\\"')
}

/**
 * コンテンツの末尾に改行コードがないなら追加する
 */
const addNewLine = (content: string): string => {
  console.log(content[content.length - 1])
  if (!content.endsWith('\n') || !content.endsWith('\r') || !content.endsWith('\r\n')) {
    return content + '\n'
  }
  return content
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
thumbnail:${
    blog.thumbnail
      ? `
  url: "${excape(blog.thumbnail.url)}"
  title: "${excape(blog.thumbnail.title)}"`
      : ' null'
  }
published: ${published}
---
${article ? addNewLine(article) : ''}`
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

export type Result = { success: true; data: BlogPost } | { success: false; error: unknown }

/**
 * 先頭と末尾の改行コードを削除する
 */
const rmLFCode = (str: string) => {
  return str.replace(/^\n+|\n+$/g, '')
}

export const loadBlogPost = async (filename: string): Promise<Result> => {
  const dirname = path.join(__dirname, `../../../contents/blogPost/${filename}.md`)

  try {
    const content = await fs.readFile(dirname, 'utf-8')
    const markdown = yamlFront.loadFront(content)
    const blogPost = {
      id: markdown['id'],
      title: markdown['title'] ?? undefined,
      about: markdown['about'] ?? undefined,
      article: rmLFCode(markdown.__content),
      createdAt: markdown['createdAt'] ?? undefined,
      updatedAt: markdown['updatedAt'] ?? undefined,
      slug: markdown['slug'] ?? undefined,
      tags: markdown['tags'],
      thumbnail: markdown['thumbnail'] ?? undefined,
      published: markdown['published'],
    }

    const result = BlogPostSchema.safeParse(blogPost)

    if (!result.success) {
      return {
        success: false,
        error: result.error.errors,
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (e) {
    if (e instanceof Error) {
      return {
        success: false,
        error: e,
      }
    } else {
      return {
        success: false,
        error: new Error('unknown error'),
      }
    }
  }
}
