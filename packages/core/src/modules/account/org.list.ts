import { roles } from '@appser/access'
import { People, PersonStatus } from 'core/models/people'
import { Controller } from 'core/server/controller'
import { z } from 'zod'

export const listAccountOrg = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      auth: { currentUser: user }
    } = ctx.state

    guard('account:org:list', { userId: user.id })

    const orgs = await People.query
      .select('orgId as id', 'status', 'org.name')
      .where({ userId: user.id })
      .where('appId', 0)
      .whereIn('status', [PersonStatus.ACTIVE, PersonStatus.PENDING])
      .whereNot('roleId', roles.org.outsideCollaborator.id)
      .join('org', 'org.id', 'people.orgId')

    ctx.body = orgs as any

    await next()
  },
  {
    state: ['auth', 'access'],
    response: {
      200: z.object({
        id: z.string(),
        status: z.number(),
        name: z.string()
      }).array()
    }
  }
)
