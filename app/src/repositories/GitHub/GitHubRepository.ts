import type { CommitResponse, Contributor, GitHubRepositoryInterface } from './types'

export class GitHubRepository implements GitHubRepositoryInterface {
  private removeDeplicateContributors(contributors: Contributor[]): Contributor[] {
    const uniqueContributors: Contributor[] = []
    contributors.forEach((contributor) => {
      if (!uniqueContributors.some((uniqueContributor) => uniqueContributor.username === contributor.username)) {
        uniqueContributors.push(contributor)
      }
    })
    return uniqueContributors
  }

  private getFilePath(slug: string): string {
    return `content/blogPost/${slug}.mdx`
  }

  private botUsers = ['github-actions[bot]', 'actions-user', 'dependabot[bot]', 'renovate[bot]']

  async getContributorsByFile(slug: string) {
    const res = await fetch(
      `https://api.github.com/repos/azukiazusa1/sapper-blog-app/commits?path=${this.getFilePath(slug)}`,
    )
    const json: CommitResponse[] = await res.json()
    const contributors = json
      .map((commit) => {
        return {
          username: commit.author.login,
          avatar: commit.author.avatar_url,
          url: commit.author.html_url,
        }
      })
      .filter((contributor) => !this.botUsers.includes(contributor.username))

    if (contributors.length === 0) {
      return [
        {
          username: 'azukiazusa1',
          avatar: 'https://avatars.githubusercontent.com/u/59350345?v=4',
          url: 'https://github.com/azukiazusa1',
        },
      ]
    } else {
      return this.removeDeplicateContributors(contributors)
    }
  }
}
