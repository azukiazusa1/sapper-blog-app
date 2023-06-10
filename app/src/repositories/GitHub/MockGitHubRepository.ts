import type { Contributor, GitHubRepositoryInterface } from "./types";

export class MockGitHubRepository implements GitHubRepositoryInterface {
  getContributorsByFile(_: string): Promise<Contributor[]> {
    return Promise.resolve([
      {
        username: "azukiazusa1",
        avatar: "https://avatars.githubusercontent.com/u/59350345?v=4",
        url: "https://github.com/azukiazusa1",
      },
    ]);
  }
}
