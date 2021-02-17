import { MockPostRepository, PostRepositoryInterFace, PostRepository } from './post'

export const POST = Symbol('post')

export interface Repositories {
  [POST]: PostRepositoryInterFace;
}

const isMock = process.env.NODE_MOCK === 'true'

export default {
  [POST]: isMock ? new MockPostRepository() : new PostRepository()
} as Repositories