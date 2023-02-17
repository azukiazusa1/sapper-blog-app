import type { PostRepositoryInterFace } from './types'
import { postsQuery } from '../../queries/Posts'
import type {
  AllPostsQuery,
  PostBySlugQuery,
  PostsQuery,
  PostsQueryVariables,
  PreviewPostQuery,
  PreviewPostsQuery,
  SearchPostsQuery,
  SearchPostsQueryVariables,
} from '../../generated/graphql'
import { postBySlugQuery } from '../../queries/PostBySlug'
import { searchPostsQuery } from '../../queries/SearchPosts'
import { request } from '../client'
import { allPostsQuery } from '../../queries/AllPosts'
import { PreviewPosts } from '../../queries/PreviewPosts'
import { previewPost } from '../../queries/PreviewPost'

export class PostRepository implements PostRepositoryInterFace {
  async get(queryVariables: PostsQueryVariables) {
    const posts = await request(postsQuery, queryVariables)
    return posts as PostsQuery
  }

  async search(queryVariables: SearchPostsQueryVariables) {
    const posts = await request(searchPostsQuery, queryVariables)

    return posts as SearchPostsQuery
  }

  async find(slug: string) {
    const post = await request(postBySlugQuery, { slug })

    return post as PostBySlugQuery
  }

  async findAll() {
    const post = await request(allPostsQuery)

    return post as AllPostsQuery
  }

  async getAllPreview() {
    const posts = await request(PreviewPosts, {}, { preview: true })

    return posts as PreviewPostsQuery
  }

  async getPreview(id: string) {
    const post = await request(previewPost, { id }, { preview: true })

    return post as PreviewPostQuery
  }
}
