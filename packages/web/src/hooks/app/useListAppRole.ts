import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import db from 'web/vendor/db'

export const listAppRoleQuery = (appId: string) => ({
  queryKey: ['app', appId, 'roles'],
  queryFn: async () => db.app.listAppRole({ appId })
})

export const useListAppRole = (appId: string) => {
  const { t } = useTranslation()

  return useQuery({
    ...listAppRoleQuery(appId),
    select(data) {
      return data.map(role => ({
        id: role.id,
        name: t(`config.role.${role.name}.name`) ?? role.name,
        description: t(`config.role.${role.name}.description`) ?? role.description
      }))
    }
  })
}
