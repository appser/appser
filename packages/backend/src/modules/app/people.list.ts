import { People, PersonStatus, personStatus } from 'backend/models/people'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

export const listAppPeople = new Controller(
  async (ctx, next) => {
    const {
      access: { can }
    } = ctx.state
    const { appId } = ctx.params
    const { deny } = can('app:people:list', { appId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    const persons = await People.query
      .select(
        'people.orgId',
        'people.appId',
        'people.status',
        'userId as user.id',
        'user.name as user.name',
        'user.avatar as user.avatar',
        'role.id as role.id',
        'role.name as role.name'
      )
      .where('people.status', PersonStatus.ACTIVE)
      .where('people.appId', appId)
      .join('user', 'user.id', 'people.userId')
      .join('role', 'role.id', 'people.roleId')

    ctx.body = persons as any

    await next()
  },
  {
    state: ['access'],
    params: z.object({
      appId: z.string().regex(rNumId)
    }),
    response: {
      200: z.object({
        orgId: z.string(),
        appId: z.string(),
        status: z.enum(personStatus),
        user: z.object({
          id: z.string(),
          name: z.string(),
          avatar: z.string().optional()
        }),
        role: z.object({
          id: z.string(),
          name: z.string()
        })
      }).array()
    }
  }
)
