import { roles } from '@appser/access'
import { People } from 'backend/models/people'

import { orgError } from '../org.error'

// at least one owner in org
export async function checkRequiredOwner(orgId: string) {
  const ownerIds = await People.query
    .where({
      orgId,
      roleId: roles.org.owner.id
    })

  if (ownerIds.length === 1) {
    throw orgError('mustHaveOneOwner')
  }
}
