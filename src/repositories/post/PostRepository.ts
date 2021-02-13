import { pipe, subscribe } from 'wonka'
import { createDummyPosts, createDummyPost } from "../../utils/createDummyPosts";
import { client } from "../client"
import type { PostRepositoryInterFace } from "./types";
import { postsQuery } from '../../queries/Posts'
import type { PostsQuery } from '../../generated/graphql';

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
  find(id: string) {
    return Promise.resolve(createDummyPost(id))
  }
}