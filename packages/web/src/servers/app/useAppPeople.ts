import { useQuery } from '@tanstack/react-query'

import { listAppPeopleQuery } from './queries'

export const useAppPeople = (appId: string) => {
  return useQuery(listAppPeopleQuery({ appId }))
}
