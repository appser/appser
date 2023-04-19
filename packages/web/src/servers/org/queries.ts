import db from 'web/vendor/db'

type GetOrgParams = Parameters<typeof db.org.getOrg>[0]
export type ListOrgAppsParams = Parameters<typeof db.org.listOrgApp>[0]
export type ListOrgPeopleParams = Parameters<typeof db.org.listOrgPeople>[0]
export type ListOrgRoleParams = Parameters<typeof db.org.listOrgRole>[0]

export const getOrgQuery = ({ orgId }: GetOrgParams) => ({
  queryKey: ['org', orgId],
  queryFn: async () => db.org.getOrg({ orgId })
})

export const listOrgAppQuery = ({ orgId }: ListOrgAppsParams) => ({
  queryKey: ['org', orgId, 'apps'],
  queryFn: async () => db.org.listOrgApp({ orgId })
})

export const listOrgPeopleQuery = ({ orgId, ...rest }: ListOrgPeopleParams) => ({
  queryKey: ['org', orgId, rest],
  queryFn: async () => db.org.listOrgPeople({ orgId, ...rest })
})

export const listOrgRoleQuery = ({ orgId }: ListOrgRoleParams) => ({
  queryKey: ['org', orgId, 'roles'],
  queryFn: async () => db.org.listOrgRole({ orgId })
})
