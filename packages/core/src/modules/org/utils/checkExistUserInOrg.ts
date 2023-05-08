import { People } from 'core/models/people'

import { orgError } from '../org.error'

interface InOrg {
  userId: string
  orgId: string
}

export async function checkExistUserInOrg({ userId, orgId }: InOrg) {
  const existPeopleInOrg = await People.query
    .where({
      orgId,
      userId
    }).first()

  if (!existPeopleInOrg) throw orgError('peopleNotFound')

  return existPeopleInOrg
}
