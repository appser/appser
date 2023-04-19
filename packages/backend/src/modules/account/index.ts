import { Module } from 'backend/server/module'

import { getAccount } from './get'
import { createAccountOrg } from './org.create'
import { listAccountOrg } from './org.list'
import { changeAccountPassword } from './password.change'
import { listAccountPolicy } from './policy.list'
import { updateAccountProfile } from './profile.update'
import { updateAccountSettings } from './settings.update'

export default new Module(({ get, put, post }) => {
  get('/account').access(getAccount).openapi({
    tags: 'account',
    operationId: 'getAccount'
  })

  put('/account/profile').auth(updateAccountProfile).openapi({
    tags: 'account',
    operationId: 'updateAccountProfile'
  })

  put('/account/settings').auth(updateAccountSettings).openapi({
    tags: 'account',
    operationId: 'updateAccountSettings'
  })

  put('/account/password').auth(changeAccountPassword).openapi({
    tags: 'account',
    operationId: 'changeAccountPassword'
  })

  get('/account/policies').access(listAccountPolicy).openapi({
    tags: 'account',
    operationId: 'listAccountPolicy'
  })

  get('/account/orgs').access(listAccountOrg).openapi({
    tags: 'account',
    operationId: 'listAccountOrg'
  })

  post('/account/orgs').access(createAccountOrg).openapi({
    tags: 'account',
    operationId: 'createOrg'
  })
})
