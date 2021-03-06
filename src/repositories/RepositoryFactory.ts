import { MockPostRepository, PostRepositoryInterFace, PostRepository } from './post'
import { TagsRepositoryInterFace, TagRepository } from './tag'

export const POST = Symbol('post')
export const TAG = Symbol('tag')

export interface Repositories {
  [POST]: PostRepositoryInterFace;
  [TAG]: TagsRepositoryInterFace;
}

const isMock = false

export default {
  [POST]: isMock ? new MockPostRepository() : new PostRepository(),
  [TAG]: new TagRepository()
} as Repositories