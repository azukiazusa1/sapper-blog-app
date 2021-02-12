export interface Post {
  fields: {
    title: string
    about: string
    slug: string
  }
}

export interface PostRepositoryInterFace {
  get(): Promise<any[]>
  find(id: string): Promise<any>
}