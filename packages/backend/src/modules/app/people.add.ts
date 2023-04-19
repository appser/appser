import { HttpStatusCode } from '@appser/shared'
import { People, PersonStatus } from 'backend/models/people'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import { checkRoleInApp } from './utils/checkRoleInApp'
import { checkExistUserInOrg } from '../org/utils/checkExistUserInOrg'

export const addAppPeople = new Controller(
  async (ctx, next) => {
    const {
      access: { can },
      getApp: { app: { orgId } }
    } = ctx.state
    const { appId } = ctx.params
    const { userId, roleId } = ctx.request.body
    const { deny } = can('app:people:add', { appId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    await checkRoleInApp({ roleId, appId })
    await checkExistUserInOrg({ userId, orgId })

    await People.query.insert({
      orgId,
      appId,
      userId,
      roleId,
      status: PersonStatus.ACTIVE,
      joinedAt: new Date().toISOString()
    })

    ctx.status = HttpStatusCode.NotContent

    await next()
  },
  {
    state: ['auth', 'access', 'getApp'],
    params: z.object({
      appId: z.string().regex(rNumId)
    }),
    body: z.object({
      userId: z.string().regex(rNumId),
      roleId: z.string()
    }),
    response: {
      204: null
    }
  }
)
