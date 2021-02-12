import type { Post } from "../repositories/post"

export const createDummyPost = (id = '1') => {
  return {
    fields: {
      slug: id,
      title: `title${id}`,
      about: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum perspiciatis quasi cum illo nihil dolorum eaque itaque quaerat deleniti tempore! Fuga animi maxime culpa nisi veritatis? Quasi officia temporibus voluptates?'
    }
  } as Post
}

export const createDummyPosts = (num: number) => {
  const dummyPosts: Post[] = []
  for (let i = 0; i < num; i++) {
    dummyPosts.push(createDummyPost(String(i)))
  }
  return dummyPosts
}
