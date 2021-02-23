import { pipe, subscribe } from 'wonka'
import { client } from "../client"
import type { PostRepositoryInterFace } from "./types";
import { postsQuery } from '../../queries/Posts'
import type { PostBySlugQuery, PostsQuery, PostsQueryVariables, SearchPostsQuery, SearchPostsQueryVariables } from '../../generated/graphql';
import { postBySlugQuery } from '../../queries/PostBySlug';
import type { TypedDocumentNode } from '@urql/core';
import type { DocumentNode } from 'graphql';
import { searchPostsQuery } from '../../queries/SearchPosts';

export class PostRepository implements PostRepositoryInterFace {
  async get(queryVariables: PostsQueryVariables) {
    const posts = await this.req(postsQuery, queryVariables)
    return posts as PostsQuery
  }

  async search(queryVariables: SearchPostsQueryVariables) {
    const posts = await this.req(searchPostsQuery, queryVariables)

    return posts as SearchPostsQuery
  }

  async find(slug: string) {
    const post = await this.req(postBySlugQuery, { slug })

    return post as PostBySlugQuery
  }

  private req (query: DocumentNode | TypedDocumentNode<any, object> | string, variables = {}) {
    return new Promise(r => {
      pipe(
        client.query(query, variables),
        subscribe(result => {
          r(result.data)
        })
      )
    })
  }
}