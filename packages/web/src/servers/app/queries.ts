import db from 'web/vendor/db'

type GetAppParams = Parameters<typeof db.app.getApp>[0]
type ListAppRoleParams = Parameters<typeof db.app.listAppRole>[0]
type ListAppPeopleParams = Parameters<typeof db.app.listAppPeople>[0]

export const getAppQuery = ({ appId }: GetAppParams) => ({
  queryKey: ['app', appId],
  queryFn: async () => db.app.getApp({ appId })
})

export const listAppRoleQuery = ({ appId }: ListAppRoleParams) => ({
  queryKey: ['app', appId, 'roles'],
  queryFn: async () => db.app.listAppRole({ appId })
})

export const listAppPeopleQuery = ({ appId }: ListAppPeopleParams) => ({
  queryKey: ['app', appId, 'people'],
  queryFn: async () => db.app.listAppPeople({ appId })
})
