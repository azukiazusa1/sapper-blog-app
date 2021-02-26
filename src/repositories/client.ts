import { ssrExchange, createClient, dedupExchange, cacheExchange, fetchExchange, TypedDocumentNode } from "@urql/core"
import type { DocumentNode } from "graphql";
import { pipe, subscribe } from 'wonka'
import fetch from 'node-fetch';

const isServerSide = typeof window === 'undefined'

const ssr = ssrExchange({
  isClient: !isServerSide,
  initialState: !isServerSide ? (window as any).__URQL_DATA__ : undefined,
})

export const client = createClient({
  url: `https://graphql.contentful.com/content/v1/spaces/${process.env.SPACE}/environments/${process.env.ENVIRONMENTS}`,
  fetch,
  exchanges: [dedupExchange, cacheExchange, ssr, fetchExchange],
  fetchOptions: () => {
    return {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`
      }
    }
  }
})

export const request = (query: DocumentNode | TypedDocumentNode<any, object> | string, variables = {}) => {
  return new Promise(r => {
    pipe(
      client.query(query, variables),
      subscribe(result => {
        r(result.data)
      })
    )
  })
}