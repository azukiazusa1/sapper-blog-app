import type {
  AllPostsQuery,
  PostBySlugQuery,
  PostsQuery,
  PostsQueryVariables,
  PreviewPostQuery,
  PreviewPostsQuery,
  SearchPostsQuery,
  SearchPostsQueryVariables,
} from "../../generated/graphql";

export interface PostRepositoryInterFace {
  get(queryVariables: PostsQueryVariables): Promise<PostsQuery>;
  search(queryVariables: SearchPostsQueryVariables): Promise<SearchPostsQuery>;
  find(slug: string): Promise<PostBySlugQuery>;
  findAll(): Promise<AllPostsQuery>;
  getAllPreview(): Promise<PreviewPostsQuery>;
  getPreview(id: string): Promise<PreviewPostQuery>;
}
