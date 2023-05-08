import { listRoleByOrgId } from './listRoleByOrgId'
import { orgError } from '../org.error'

export interface InOrg {
  roleId: string
  orgId: string
}

export async function checkRoleInOrg({ roleId, orgId }: InOrg) {
  const rid = BigInt(roleId)
  const roles = await listRoleByOrgId(orgId)
  const isAvailable = roles.some(role => BigInt(role.id) === rid)

  if (!isAvailable) {
    throw orgError('unavailableRole')
  }
}
