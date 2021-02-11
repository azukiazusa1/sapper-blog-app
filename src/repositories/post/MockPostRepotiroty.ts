import type { PostRepositoryInterFace } from "./types";

export class MockPostRepository implements PostRepositoryInterFace {
  get() {
    return Promise.resolve([{
      slug: '1',
      title: 'title1',
      about: 'lorem ipsum',
    }])
  }
  find(id: string) {
    return Promise.resolve({
      slug: '1',
      title: 'title1',
      about: 'lorem ipsum',
    })
  }
}