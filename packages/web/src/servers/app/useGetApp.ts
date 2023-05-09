import { useQuery } from '@tanstack/react-query'
import db from 'web/vendor/db'

export const getAppQuery = (appId: string) => ({
  queryKey: ['app', appId],
  queryFn: async () => db.app.getApp({ appId })
})

export const useGetApp = (appId: string) => {
  return useQuery({
    ...getAppQuery(appId),
    select(data) {
      return {
        name: data.name ?? 'Untitled App',
        ...data
      }
    }
  })
}
