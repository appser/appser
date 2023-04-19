import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { listOrgRoleQuery } from './queries'

import type { ListOrgRoleParams } from './queries'

export const useListOrgRole = (query: ListOrgRoleParams) => {
  const { t } = useTranslation()

  return useQuery({
    ...listOrgRoleQuery(query),
    select(data) {
      return data.map(role => ({
        id: role.id,
        name: t(`config.role.${role.name}.name`) ?? role.name,
        description: t(`config.role.${role.name}.description`) ?? role.description
      }))
    }
  })
}
