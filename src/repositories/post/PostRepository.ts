import { pipe, subscribe } from 'wonka'
import { client } from "../client"
import type { PostRepositoryInterFace } from "./types";
import { postsQuery } from '../../queries/Posts'
import type { PostBySlugQuery, PostsQuery } from '../../generated/graphql';
import { postBySlugQuery } from '../../queries/PostBySlug';

export class PostRepository implements PostRepositoryInterFace {
  async get() {
    const posts = await new Promise(r => {
      pipe(
        client.query(postsQuery, {}),
        subscribe(result => {
          r(result.data)
        })
      )
    })

    return posts as PostsQuery
  }
  async find(slug: string) {
    const post = await new Promise(r => {
      pipe(
        client.query(postBySlugQuery, { slug }),
        subscribe(result => {
          r(result.data)
        })
      )
    })

    return post as PostBySlugQuery
  }
}