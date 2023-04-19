import { useQuery } from '@tanstack/react-query'

import { getAppQuery } from './queries'

export const useGetApp = (appId: string) => {
  return useQuery({
    ...getAppQuery({ appId }),
    select(data) {
      return {
        name: data.name ?? 'Untitled App',
        ...data
      }
    }
  })
}
