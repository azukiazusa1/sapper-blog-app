import { pipe, subscribe } from 'wonka'
import { createDummyPosts, createDummyPost } from "../../utils/createDummyPosts";
import { client } from "../client"
import type { PostRepositoryInterFace } from "./types";

export class MockPostRepository implements PostRepositoryInterFace {
  async get() {
    const q = `
    query{
      blogPostCollection(limit: 10){
        items{
          title
          slug
          about
          tagsCollection(limit: 5) {
            items {
              name
            }
          }
        }
      }
    }
  
  `
    const posts = await new Promise(r => {
      pipe(
        client.query(q, {}),
        subscribe(result => {
          r(result.data.blogPostCollection.items)
        })
      )
    })

    return posts as any
  }
  find(id: string) {
    return Promise.resolve(createDummyPost(id))
  }
}