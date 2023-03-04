import type { MetaLinkProps } from 'contentful-management'
import { compareTwoStrings } from 'string-similarity'
import { loadAllBlogPost, Result } from './fileOperation'
import type { BlogPost } from './types'

export const searchRelatedArticles = async (blogPost: BlogPost): Promise<MetaLinkProps[]> => {
  const allBlogPost = await loadAllBlogPost()
  console.log('loaded')

  const result = allBlogPost
    .filter((a): a is Extract<Result, { success: true }> => {
      if (!a.success) {
        return false
      }
      if (!a.data.published) {
        return false
      }
      return a.data.id !== blogPost.id
    })
    .sort((a, b) => {
      const similaritya = compareTwoStrings(blogPost.article || '', a.data.article || '')
      const similarityb = compareTwoStrings(b.data.article || '', blogPost.article || '')
      return similarityb - similaritya
    })

  return result.slice(0, 3).map((a) => {
    return {
      type: 'Link',
      linkType: 'Entry',
      id: a.data.id,
    }
  })
}
