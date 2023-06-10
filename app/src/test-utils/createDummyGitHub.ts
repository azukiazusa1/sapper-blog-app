import type { CommitResponse } from "../repositories/GitHub";
import { faker } from "@faker-js/faker";

export const createDummyGitHubCommit = ({
  username = faker.internet.userName(),
  avatar = faker.internet.avatar(),
  url = faker.internet.url(),
} = {}): CommitResponse => {
  return {
    url: faker.internet.url(),
    sha: faker.git.commitSha(),
    node_id: faker.random.alpha(),
    html_url: faker.internet.url(),
    comments_url: faker.internet.url(),
    commit: {
      url: faker.internet.url(),
      author: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        date: faker.date.past().toISOString(),
      },
      committer: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        date: faker.date.past().toISOString(),
      },
      message: faker.git.commitMessage(),
      tree: {
        url: faker.internet.url(),
        sha: faker.random.alpha(),
      },
      comment_count: faker.datatype.number(),
      verification: {
        verified: true,
        reason: faker.lorem.sentence(),
        signature: null,
        payload: null,
      },
    },
    author: {
      login: username,
      id: faker.datatype.number(),
      node_id: faker.random.alpha(),
      avatar_url: avatar,
      gravatar_id: faker.random.alpha(),
      url: faker.internet.url(),
      html_url: url,
      followers_url: faker.internet.url(),
      following_url: faker.internet.url(),
      gists_url: faker.internet.url(),
      starred_url: faker.internet.url(),
      subscriptions_url: faker.internet.url(),
      organizations_url: faker.internet.url(),
      repos_url: faker.internet.url(),
      events_url: faker.internet.url(),
      received_events_url: faker.internet.url(),
      type: faker.random.word(),
      site_admin: true,
    },
    committer: {
      login: username,
      id: faker.datatype.number(),
      node_id: faker.random.alpha(),
      avatar_url: faker.internet.avatar(),
      gravatar_id: faker.random.alpha(),
      url: faker.internet.url(),
      html_url: faker.internet.url(),
      followers_url: faker.internet.url(),
      following_url: faker.internet.url(),
      gists_url: faker.internet.url(),
      starred_url: faker.internet.url(),
      subscriptions_url: faker.internet.url(),
      organizations_url: faker.internet.url(),
      repos_url: faker.internet.url(),
      events_url: faker.internet.url(),
      received_events_url: faker.internet.url(),
      type: faker.random.word(),
      site_admin: true,
    },
    parents: [
      {
        url: faker.internet.url(),
        sha: faker.random.alpha(),
      },
    ],
  };
};
