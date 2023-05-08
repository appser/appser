import { Module } from 'core/server/module'

import { createOrgApp } from './app.create'
import { listOrgApp } from './app.list'
import { deleteOrg } from './delete'
import { getOrg } from './get'
import { createOrgInvitation } from './invitation.create'
import { listOrgPeople } from './people.list'
import { removeOrgPeople } from './people.remove'
import { changeOrgPeopleRole } from './people.role.change'
import { listOrgRole } from './role.list'
import { updateOrg } from './update'

export default new Module(({ get, post, del, patch }) => {
  get('/orgs/:orgId').access(getOrg).openapi({
    tags: 'org',
    operationId: 'getOrg'
  })

  del('/orgs/:orgId').access(deleteOrg).openapi({
    tags: 'org',
    operationId: 'deleteOrg'
  })

  patch('/orgs/:orgId').access(updateOrg).openapi({
    tags: 'org',
    operationId: 'updateOrg'
  })

  post('/orgs/:orgId/apps').access(createOrgApp).openapi({
    tags: 'org',
    operationId: 'createOrgApp'
  })

  get('/orgs/:orgId/apps').access(listOrgApp).openapi({
    tags: 'org',
    operationId: 'listOrgApp'
  })

  get('/orgs/:orgId/people').access(listOrgPeople).openapi({
    tags: 'org',
    operationId: 'listOrgPeople'
  })

  get('/orgs/:orgId/roles').access(listOrgRole).openapi({
    tags: 'org',
    operationId: 'listOrgRole'
  })

  patch('/orgs/:orgId/people/:userId/role').access(changeOrgPeopleRole).openapi({
    tags: 'org',
    operationId: 'changeOrgPeopleRole'
  })

  del('/orgs/:orgId/people/:userId').access(removeOrgPeople).openapi({
    tags: 'org',
    operationId: 'removeOrgPeople'
  })

  post('/orgs/:orgId/invitation').access(createOrgInvitation).openapi({
    tags: 'org',
    operationId: 'createOrgInvitation'
  })
})
