'use client'

import { QueryClient } from "@tanstack/react-query"

let clientQueryClientSingleton: QueryClient | undefined = undefined

function getQueryClientSingleton() {
  if (typeof window !== 'undefined') {
    if (clientQueryClientSingleton) return clientQueryClientSingleton
    clientQueryClientSingleton = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          retry: 3,
        },
      },
    })
    return clientQueryClientSingleton
  }
  return new QueryClient()
}

export const getQueryClient = () => getQueryClientSingleton()
