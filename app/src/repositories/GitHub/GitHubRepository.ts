import secrets from "$lib/server/secrets";
import type {
  CommitResponse,
  Contributor,
  GitHubRepositoryInterface,
} from "./types";

export class GitHubRepository implements GitHubRepositoryInterface {
  private readonly defaultContributors: Contributor[] = [
    {
      username: "azukiazusa1",
      avatar: "https://avatars.githubusercontent.com/u/59350345?v=4",
      url: "https://github.com/azukiazusa1",
    },
  ];

  private removeDeplicateContributors(
    contributors: Contributor[],
  ): Contributor[] {
    const uniqueContributors: Contributor[] = [];
    contributors.forEach((contributor) => {
      if (
        !uniqueContributors.some(
          (uniqueContributor) =>
            uniqueContributor.username === contributor.username,
        )
      ) {
        uniqueContributors.push(contributor);
      }
    });
    return uniqueContributors;
  }

  private getFilePath(slug: string): string {
    return `contents/blogPost/${slug}.md`;
  }

  private botUsers = [
    "github-actions[bot]",
    "actions-user",
    "dependabot[bot]",
    "renovate[bot]",
  ];

  // プリレンダリング中は同じ記事に対して複数ページ（日英ロケールなど）から
  // 呼ばれるため、slug ごとに結果を再利用して GitHub API の呼び出しを 1 回に抑える
  private contributorsCache = new Map<string, Promise<Contributor[]>>();

  getContributorsByFile(slug: string): Promise<Contributor[]> {
    let cached = this.contributorsCache.get(slug);
    if (!cached) {
      cached = this.fetchContributorsByFile(slug);
      this.contributorsCache.set(slug, cached);
    }
    return cached;
  }

  private async fetchContributorsByFile(slug: string) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/azukiazusa1/sapper-blog-app/commits?path=${this.getFilePath(
          slug,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${secrets.githubToken}`,
          },
        },
      );

      if (!res.ok) {
        console.warn(
          `Failed to fetch GitHub contributors for ${slug}: ${res.status} ${res.statusText}`,
        );
        return this.defaultContributors;
      }

      const json: unknown = await res.json();
      if (!Array.isArray(json)) {
        console.warn(
          `Failed to fetch GitHub contributors for ${slug}: unexpected response`,
        );
        return this.defaultContributors;
      }

      const contributors = (json as CommitResponse[])
        .filter((commit) => commit.author)
        .map((commit) => {
          return {
            username: commit.author.login,
            avatar: commit.author.avatar_url,
            url: commit.author.html_url,
          };
        })
        .filter((contributor) => !this.botUsers.includes(contributor.username));

      if (contributors.length === 0) {
        return this.defaultContributors;
      } else {
        return this.removeDeplicateContributors(contributors);
      }
    } catch (error) {
      console.warn(`Failed to fetch GitHub contributors for ${slug}`, error);
      return this.defaultContributors;
    }
  }
}
