import { roles } from '@appser/access'
import { People, PersonStatus, personStatus } from 'backend/models/people'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { z } from 'zod'

export const listAccountOrg = new Controller(
  async (ctx, next) => {
    const {
      access: { can },
      auth: { currentUser: user }
    } = ctx.state
    const { deny } = can('account:org:list', { userId: user.id })

    if (deny) return ctx.throw(serverError('accessForbidden'))

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
        status: z.enum(personStatus),
        name: z.string()
      }).array()
    }
  }
)
