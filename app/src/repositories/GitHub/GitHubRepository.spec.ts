import { describe, test, expect, vi } from "vitest";
import { rest } from "msw";
import { createDummyGitHubCommit } from "../../test-utils/createDummyGitHub";
import type { Contributor } from "./types";
import { GitHubRepository } from "./GitHubRepository";
import { server } from "../../test-utils/server";
const gitHubRepository = new GitHubRepository();

describe("GitHubRepository", () => {
  test("commit から contributor の一覧を取得する", async () => {
    const fn = vi.fn();
    server.use(
      rest.get(
        "https://api.github.com/repos/azukiazusa1/sapper-blog-app/commits",
        (req, res, ctx) => {
          fn(req.url.searchParams.get("path"));
          return res(
            ctx.status(200),
            ctx.json([
              createDummyGitHubCommit({
                username: "azukiazusa1",
                avatar: "avatar1",
                url: "url1",
              }),
              createDummyGitHubCommit({
                username: "azukiazusa2",
                avatar: "avatar2",
                url: "url2",
              }),
            ])
          );
        }
      )
    );
    const contributors = await gitHubRepository.getContributorsByFile("slug");
    expect(contributors).toEqual<Contributor[]>([
      {
        username: "azukiazusa1",
        avatar: "avatar1",
        url: "url1",
      },
      {
        username: "azukiazusa2",
        avatar: "avatar2",
        url: "url2",
      },
    ]);
    expect(fn).toBeCalledWith("contents/blogPost/slug.md");
  });

  test("bot の commit は除外する", async () => {
    server.use(
      rest.get(
        "https://api.github.com/repos/azukiazusa1/sapper-blog-app/commits",
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([
              createDummyGitHubCommit({
                username: "azukiazusa1",
                avatar: "avatar1",
                url: "url1",
              }),
              createDummyGitHubCommit({
                username: "github-actions[bot]",
                avatar: "avatar1",
                url: "url1",
              }),
              createDummyGitHubCommit({
                username: "actions-user",
                avatar: "avatar2",
                url: "url2",
              }),
              createDummyGitHubCommit({
                username: "dependabot[bot]",
                avatar: "avatar3",
                url: "url3",
              }),
              createDummyGitHubCommit({
                username: "renovate[bot]",
                avatar: "avatar4",
                url: "url4",
              }),
            ])
          );
        }
      )
    );
    const contributors = await gitHubRepository.getContributorsByFile("slug");
    expect(contributors).toEqual<Contributor[]>([
      {
        username: "azukiazusa1",
        avatar: "avatar1",
        url: "url1",
      },
    ]);
  });

  test("commit が存在しない場合は自分を返す", async () => {
    server.use(
      rest.get(
        "https://api.github.com/repos/azukiazusa1/sapper-blog-app/commits",
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json([]));
        }
      )
    );
    const contributors = await gitHubRepository.getContributorsByFile("slug");
    expect(contributors).toEqual<Contributor[]>([
      {
        username: "azukiazusa1",
        avatar: "https://avatars.githubusercontent.com/u/59350345?v=4",
        url: "https://github.com/azukiazusa1",
      },
    ]);
  });

  test("重複した contributor は除外する", async () => {
    server.use(
      rest.get(
        "https://api.github.com/repos/azukiazusa1/sapper-blog-app/commits",
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([
              createDummyGitHubCommit({
                username: "azukiazusa1",
                avatar: "avatar1",
                url: "url1",
              }),
              createDummyGitHubCommit({
                username: "azukiazusa1",
                avatar: "avatar1",
                url: "url1",
              }),
              createDummyGitHubCommit({
                username: "azukiazusa2",
                avatar: "avatar2",
                url: "url2",
              }),
              createDummyGitHubCommit({
                username: "azukiazusa1",
                avatar: "avatar1",
                url: "url1",
              }),
              createDummyGitHubCommit({
                username: "azukiazusa3",
                avatar: "avatar",
                url: "url3",
              }),
            ])
          );
        }
      )
    );
    const contributors = await gitHubRepository.getContributorsByFile("slug");
    expect(contributors).toEqual<Contributor[]>([
      {
        avatar: "avatar1",
        url: "url1",
        username: "azukiazusa1",
      },
      {
        avatar: "avatar2",
        url: "url2",
        username: "azukiazusa2",
      },
      {
        avatar: "avatar",
        url: "url3",
        username: "azukiazusa3",
      },
    ]);
  });
});
