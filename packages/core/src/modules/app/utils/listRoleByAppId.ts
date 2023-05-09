import { APP_BUILD_IN_ROLE_ID_RANGE } from '@appser/access'
import { Role } from 'core/models/role'

const [minAppRoleId, maxAppRoleId] = APP_BUILD_IN_ROLE_ID_RANGE

export const listRoleByAppId = async (appId: string) => {
  const roles = await Role.query
    .select('id', 'name', 'description')
    .where({
      appId
    })
    .orWhere('id', '>=', minAppRoleId)
    .andWhere('id', '<', maxAppRoleId)

  return roles
}
