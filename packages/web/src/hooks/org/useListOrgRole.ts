import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import db from 'web/vendor/db'

export type ListOrgRoleParams = Parameters<typeof db.org.listOrgRole>[0]

export const listOrgRoleQuery = (orgId: string) => ({
  queryKey: ['org', orgId, 'roles'],
  queryFn: async () => db.org.listOrgRole({ orgId })
})

export const useListOrgRole = (query: ListOrgRoleParams) => {
  const { t } = useTranslation()

  return useQuery({
    ...listOrgRoleQuery(query.orgId),
    select(data) {
      return data.map(role => ({
        id: role.id,
        name: t(`config.role.${role.name}.name`) ?? role.name,
        description: t(`config.role.${role.name}.description`) ?? role.description
      }))
    }
  })
}
