import {
  ssrExchange,
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
} from "@urql/core";
import type { Client, TypedDocumentNode } from "@urql/core";
import type { DocumentNode } from "graphql";
import { pipe, subscribe } from "wonka";
import secrets from "$lib/server/secrets";

const isServerSide = typeof window === "undefined";

const ssr = ssrExchange({
  isClient: !isServerSide,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState: !isServerSide ? (window as any).__URQL_DATA__ : undefined,
});

const clients = new Map<boolean, Client>();

export const client = (preview: boolean) => {
  const cachedClient = clients.get(preview);

  if (cachedClient) {
    return cachedClient;
  }

  const createdClient = createClient({
    url: `https://graphql.contentful.com/content/v1/spaces/${secrets.space}/environments/${secrets.environments}`,
    fetch,
    exchanges: [dedupExchange, cacheExchange, ssr, fetchExchange],
    requestPolicy: preview ? "network-only" : "cache-first",
    fetchOptions: () => {
      return {
        headers: {
          Authorization: `Bearer ${
            preview ? secrets.previewApiKey : secrets.apiKey
          }`,
        },
      };
    },
  });

  clients.set(preview, createdClient);

  return createdClient;
};

export const request = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: DocumentNode | TypedDocumentNode<any, object> | string,
  variables = {},
  { preview = false } = {},
) => {
  return new Promise((r) => {
    pipe(
      client(preview).query(query, variables),
      subscribe((result) => {
        r(result.data);
      }),
    );
  });
};
