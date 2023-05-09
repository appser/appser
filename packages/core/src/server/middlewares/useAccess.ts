// TODO: when the role id < SYSTEM_ROLE_MAX_ID, the policies can be combined.
import Access, { roles } from '@appser/access'
import db from 'core/db'
import { App } from 'core/models/app'
import { People, PersonStatus } from 'core/models/people'
import { Role } from 'core/models/role'
import { authError } from 'core/modules/auth/auth.error'
import jsonTemplate from 'core/utils/jsonTemplate'

import { serverError } from '../server.error'

import type { TPeople } from 'core/models/people'
import type { TRole } from 'core/models/role'
import type { Middleware } from 'koa'

export const useAccess: Middleware = async (ctx, next) => {
  if (!ctx.state.auth) throw new Error('Missing auth state')

  const { currentUser, token } = ctx.state.auth
  const access = new Access()

  if (currentUser.account.roleId !== token.payload.rol) return ctx.throw(authError('account.roleChanged'))

  const [peoples, accountRole] = await Promise.all([
    People.query
      .select('people.*', db.raw('to_json(role.*) as role')) // Postgres only
      .where({
        userId: currentUser.id,
        status: PersonStatus.ACTIVE
      })
      .whereNot('roleId', roles.org.outsideCollaborator.id)
      .join('role', 'role.id', 'people.roleId'),
    Role.query.select('*').where({ id: currentUser.account.roleId }).first()
  ])

  const orgResource = peoples.reduce<Record<string, { appIds: string[] }>>((acc, p: TPeople & { role: TRole }) => {
    const appIds = acc[p.orgId]?.appIds || []

    if (p.appId !== '0') appIds.push(p.appId)

    acc[p.orgId] = {
      appIds
    }

    return acc
  }, {})
  // The org owner can access all the apps in the org
  const orgIdsWithOwnerRole = peoples.filter(p => p.roleId === roles.org.owner.id).map(p => p.orgId)

  if (orgIdsWithOwnerRole.length > 0) {
    const orgApps: Array<{ orgId: string; appIds: string[] }> = await App.query.whereIn(
      'orgId',
      orgIdsWithOwnerRole
    )
      .select(db.raw('ARRAY_AGG(id) as ??', 'appIds'), 'orgId')
      .groupBy('orgId')

    orgApps.forEach(w => {
      orgResource[w.orgId].appIds = w.appIds
    })
  }

  // apply account dataset role
  accountRole?.policies.forEach(rule => {
    const policy = jsonTemplate(rule, { userId: currentUser.id })
    policy.role = accountRole.id
    access.grant(policy)
  })

  // apply role from peoples
  peoples.forEach((person: TPeople & { role: TRole }) => {
    person.role?.policies.forEach(rule => {
      const policy = jsonTemplate(rule, {
        orgId: person.orgId,
        appId: person.appId,
        appIds: orgResource[person.orgId]?.appIds
      })
      policy.role = String(person.role.id)
      access.grant(policy)
    })
  })

  const guard = (...args: Parameters<typeof access.can>) => {
    const permission = access.can(...args)

    if (permission.deny) return ctx.throw(serverError('accessForbidden'))

    return permission
  }

  Object.assign(ctx.state, {
    access: {
      ac: access,
      guard,
      orgResource
    }
  })

  await next()
}

declare module 'core/server/controller' {
  interface State {
    access: {
      ac: Access
      guard: Access['can']
      orgResource: Record<string, { appIds: string[] }>
    }
  }
}
