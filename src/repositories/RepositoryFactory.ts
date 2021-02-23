import { MockPostRepository, PostRepositoryInterFace, PostRepository } from './post'

export const POST = Symbol('post')

export interface Repositories {
  [POST]: PostRepositoryInterFace;
}

const isMock = false

export default {
  [POST]: isMock ? new MockPostRepository() : new PostRepository()
} as Repositories