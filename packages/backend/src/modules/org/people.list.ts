import { roles } from '@appser/access'
import { People, PersonStatus, personStatus } from 'backend/models/people'
import { Controller } from 'backend/server/controller'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

export const listOrgPeople = new Controller(
  async (ctx, next) => {
    const {
      access: { guard }
    } = ctx.state
    const { orgId } = ctx.params
    const { kind } = ctx.query

    guard('org:people:list', { orgId })

    const query = People.query
      .select(
        'people.orgId',
        'people.status',
        'userId as user.id',
        'user.name as user.name',
        'user.avatar as user.avatar',
        'role.id as role.id',
        'role.name as role.name'
      )
      .where('people.orgId', orgId)
      .where('people.appId', 0)
      .join('user', 'user.id', 'people.userId')
      .join('role', 'role.id', 'people.roleId')

    if (kind === 'member') {
      query
        .where('people.status', PersonStatus.ACTIVE)
        .whereNot('roleId', roles.org.outsideCollaborator.id)
    }

    if (kind === 'outsideCollaborator') {
      query
        .where('people.status', PersonStatus.ACTIVE)
        .where('roleId', roles.org.outsideCollaborator.id)
    }

    if (kind === 'pending') {
      query.where('people.status', PersonStatus.PENDING)
    }

    if (kind === 'failed') {
      query.where('people.status', PersonStatus.FAILED)
    }

    ctx.body = await query

    await next()
  },
  {
    state: ['access'],
    params: z.object({
      orgId: z.string().regex(rNumId)
    }),
    query: z.object({
      kind: z.enum(['member', 'outsideCollaborator', 'pending', 'failed'])
    }),
    response: {
      200: z.object({
        orgId: z.string(),
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
