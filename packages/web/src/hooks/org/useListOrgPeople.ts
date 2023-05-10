import { useQuery } from '@tanstack/react-query'
import db from 'web/vendor/db'

type ListOrgPeopleParams = Parameters<typeof db.org.listOrgPeople>[0]

export const listOrgPeopleQuery = ({ orgId, ...rest }: ListOrgPeopleParams) => ({
  queryKey: ['org', orgId, rest],
  queryFn: async () => db.org.listOrgPeople({ orgId, ...rest })
})

export const useListOrgPeople = (query: ListOrgPeopleParams) => {
  return useQuery(listOrgPeopleQuery(query))
}
