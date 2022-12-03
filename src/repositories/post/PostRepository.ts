import type { PostRepositoryInterFace } from './types'
import { postsQuery } from '../../queries/Posts'
import type {
  AllPostsQuery,
  PostBySlugQuery,
  PostsQuery,
  PostsQueryVariables,
  SearchPostsQuery,
  SearchPostsQueryVariables,
} from '../../generated/graphql'
import { postBySlugQuery } from '../../queries/PostBySlug'
import { searchPostsQuery } from '../../queries/SearchPosts'
import { request } from '../client'
import { allPostsQuery } from '../../queries/AllPosts'

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
}
