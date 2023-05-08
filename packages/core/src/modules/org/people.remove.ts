import { roles } from '@appser/access'
import { HttpStatusCode } from '@appser/common'
import { People } from 'core/models/people'
import { Controller } from 'core/server/controller'
import { rNumId } from 'core/utils/regex'
import { z } from 'zod'

import { orgError } from './org.error'
import { checkExistUserInOrg } from './utils/checkExistUserInOrg'
import { checkRequiredOwner } from './utils/checkRequiredOwner'

export const removeOrgPeople = new Controller(
  async (ctx, next) => {
    const {
      auth: { currentUser },
      access: { guard }
    } = ctx.state
    const { orgId, userId } = ctx.params

    guard('org:people:remove', { orgId })

    if (currentUser.id === userId) return ctx.throw(orgError('peopleRemoveSelf'))

    const people = await checkExistUserInOrg({ orgId, userId })

    if (people.roleId === roles.org.owner.id) {
      await checkRequiredOwner(orgId)
    }

    await People.query.where({ orgId, userId }).delete()

    ctx.status = HttpStatusCode.NotContent

    await next()
  },
  {
    state: ['auth', 'access'],
    params: z.object({
      orgId: z.string().regex(rNumId),
      userId: z.string().regex(rNumId)
    }),
    response: {
      204: null
    }
  }
)
