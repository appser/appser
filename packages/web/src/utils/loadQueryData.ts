import type { OnlyRequired } from '@appser/shared'
import type { QueryClient, QueryOptions } from '@tanstack/react-query'

type PromiseType<T> = T extends Promise<infer U> ? U : never

export async function loadQueryData<T extends OnlyRequired<QueryOptions, 'queryKey' | 'queryFn'>>(
  queryClient: QueryClient,
  query: T
) {
  return (queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query))) as Promise<
    PromiseType<ReturnType<T['queryFn']>>
  >
}
