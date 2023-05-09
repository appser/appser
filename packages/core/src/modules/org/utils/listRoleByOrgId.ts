import { ORG_BUILD_IN_ROLE_ID_RANGE, roles as defaultRoles } from '@appser/access'
import { Role } from 'core/models/role'

const [minOrgRoleId, maxOrgRoleId] = ORG_BUILD_IN_ROLE_ID_RANGE

export const listRoleByOrgId = async (orgId: string) => {
  const roles = await Role.query
    .select('id', 'name', 'description')
    .where({
      orgId
    })
    .orWhere('id', '>=', minOrgRoleId)
    .andWhere('id', '<', maxOrgRoleId)
    .andWhereNot('id', defaultRoles.org.outsideCollaborator.id)

  return roles
}
