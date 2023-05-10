import { useQuery } from '@tanstack/react-query'
import db from 'web/vendor/db'

export const listAppPeopleQuery = (appId: string) => ({
  queryKey: ['app', appId, 'people'],
  queryFn: async () => db.app.listAppPeople({ appId })
})

export const useAppPeople = (appId: string) => {
  return useQuery(listAppPeopleQuery(appId))
}
