import { listRoleByAppId } from './listRoleByAppId'
import { appError } from '../app.error'

interface InApp {
  roleId: string
  appId: string
}

export async function checkRoleInApp({ roleId, appId }: InApp) {
  const rid = BigInt(roleId)
  const roles = await listRoleByAppId(appId)
  const isAvailable = roles.some(role => BigInt(role.id) === rid)

  if (!isAvailable) throw appError('unavailableRole')
}
