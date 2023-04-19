import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { onMutationError, onQueryError } from 'web/error'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10
    }
  },
  queryCache: new QueryCache({
    onError: onQueryError
  }),
  mutationCache: new MutationCache({
    onError: onMutationError
  })
})

export default queryClient
