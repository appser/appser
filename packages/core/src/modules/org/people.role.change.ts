import { roles } from '@appser/access'
import { HttpStatusCode } from '@appser/common'
import { People } from 'backend/models/people'
import { Controller } from 'backend/server/controller'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import { orgError } from './org.error'
import { checkExistUserInOrg } from './utils/checkExistUserInOrg'
import { checkRequiredOwner } from './utils/checkRequiredOwner'
import { checkRoleInOrg } from './utils/checkRoleInOrg'

export const changeOrgPeopleRole = new Controller(
  async (ctx, next) => {
    const {
      auth: { currentUser },
      access: { guard }
    } = ctx.state
    const { orgId, userId } = ctx.params
    const { roleId } = ctx.request.body

    guard('org:people:edit', { orgId })

    if (currentUser.id === userId) return ctx.throw(orgError('cannotChangeSelfRole'))

    const ownerRoleId = roles.org.owner.id
    const people = await checkExistUserInOrg({ orgId, userId })

    // at least one owner in org
    if (people.roleId === ownerRoleId && roleId !== ownerRoleId) {
      await checkRequiredOwner(orgId)
    }

    await checkRoleInOrg({ roleId, orgId })
    await People.query.update({ roleId }).where({ orgId, userId })

    ctx.status = HttpStatusCode.NotContent

    await next()
  },
  {
    state: ['auth', 'access'],
    params: z.object({
      orgId: z.string().regex(rNumId),
      userId: z.string().regex(rNumId)
    }),
    body: z.object({
      roleId: z.string().regex(rNumId)
    }),
    response: {
      204: null
    }
  }
)
