import { ssrExchange, createClient, dedupExchange, cacheExchange, fetchExchange } from "@urql/core"
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

