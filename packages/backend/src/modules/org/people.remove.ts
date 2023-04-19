import { roles } from '@appser/access'
import { HttpStatusCode } from '@appser/shared'
import { People } from 'backend/models/people'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import { orgError } from './org.error'
import { checkExistUserInOrg } from './utils/checkExistUserInOrg'
import { checkRequiredOwner } from './utils/checkRequiredOwner'

export const removeOrgPeople = new Controller(
  async (ctx, next) => {
    const {
      auth: { currentUser },
      access: { can }
    } = ctx.state
    const { orgId, userId } = ctx.params
    const { deny } = can('org:people:remove', { orgId })

    if (deny) return ctx.throw(serverError('accessForbidden'))
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
