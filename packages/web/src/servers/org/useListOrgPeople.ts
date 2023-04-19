import { useQuery } from '@tanstack/react-query'

import { listOrgPeopleQuery } from './queries'

import type { ListOrgPeopleParams } from './queries'

export const useListOrgPeople = (query: ListOrgPeopleParams) => {
  return useQuery(listOrgPeopleQuery(query))
}
