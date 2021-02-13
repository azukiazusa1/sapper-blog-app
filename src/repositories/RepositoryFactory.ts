import { MockPostRepository, PostRepositoryInterFace, PostRepository } from './post'

export const POST = Symbol('post')

export interface Repositories {
  [POST]: PostRepositoryInterFace;
}

export default {
  [POST]: new PostRepository()
} as Repositories