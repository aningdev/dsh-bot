import { RPCJsonSerializer } from '@orpc/client'
import { hashKey, QueryClient } from '@tanstack/react-query'

const serializer = new RPCJsonSerializer()

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      queryKeyHashFn: (queryKey) => {
        const { json, meta } = serializer.serializeJson(queryKey)
        return hashKey([json, meta?.map((entry) => JSON.stringify(entry)).sort()])
      },
    },
    mutations: { retry: false },
  },
})

// MessagePort operations remain available without a network connection.
queryClient.setQueryDefaults(['ipc'], { networkMode: 'always' })
queryClient.setMutationDefaults(['ipc'], { networkMode: 'always' })
