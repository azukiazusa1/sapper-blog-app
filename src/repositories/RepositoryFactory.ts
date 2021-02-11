import { MockPostRepository, PostRepositoryInterFace } from './post'

export const POST = Symbol('post')

export interface Repositories {
  [POST]: PostRepositoryInterFace;
}

export default {
  [POST]: new MockPostRepository()
} as Repositories