import { roles } from '@appser/access'
import db from 'backend/db'
import { Org } from 'backend/models/org'
import { People, PersonStatus } from 'backend/models/people'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { z } from 'zod'

export const createAccountOrg = new Controller(
  async (ctx, next) => {
    const {
      access: { can },
      auth: { currentUser: user }
    } = ctx.state
    const { name } = ctx.request.body
    const { deny } = can('account:org:create', { userId: user.id })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    await db.transaction(async trx => {
      const [org] = await Org.query
        .insert({
          name,
          creatorId: user.id
        })
        .returning(['id', 'name'])
        .transacting(trx)

      await People.query
        .insert({
          orgId: org.id,
          appId: '0',
          userId: user.id,
          roleId: roles.org.owner.id,
          status: PersonStatus.ACTIVE,
          joinedAt: new Date().toISOString()
        })
        .transacting(trx)

      ctx.body = org
    })

    await next()
  },
  {
    state: ['auth', 'access'],
    body: z.object({
      name: z.string().max(128)
    }),
    response: {
      200: Org.schema.pick({
        id: true,
        name: true
      })
    }
  }
)
