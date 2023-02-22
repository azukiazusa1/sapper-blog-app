import { MockPostRepository, PostRepository } from './post'
import type { PostRepositoryInterFace } from './post'
import { TagRepository } from './tag'
import type { TagsRepositoryInterFace } from './tag'
import type { GitHubRepositoryInterface } from './GitHub/types'
import { GitHubRepository } from './GitHub/GitHubRepository'
import { MockGitHubRepository } from './GitHub'

export const POST = Symbol('post')
export const TAG = Symbol('tag')
export const GITHUB = Symbol('github')

export interface Repositories {
  [POST]: PostRepositoryInterFace
  [TAG]: TagsRepositoryInterFace
  [GITHUB]: GitHubRepositoryInterface
}

const isMock = false

export default {
  [POST]: isMock ? new MockPostRepository() : new PostRepository(),
  [TAG]: new TagRepository(),
  [GITHUB]: process.env.VERCEL_ENV === 'production' ? new GitHubRepository() : new MockGitHubRepository(),
} satisfies Repositories
