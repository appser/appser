import { PersonStatus } from '@appser/common'
import { People } from 'core/models/people'
import { Controller } from 'core/server/controller'
import { rNumId } from 'core/utils/regex'
import { z } from 'zod'

export const listAppPeople = new Controller(
  async (ctx, next) => {
    const {
      access: { guard }
    } = ctx.state
    const { appId } = ctx.params

    guard('app:people:list', { appId })

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
        status: z.number().int(),
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
