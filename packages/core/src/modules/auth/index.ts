import { Module } from 'backend/server/module'

import { getAuthConfig } from './config.get'
import { authWithEmail } from './email.with'
import { revokeToken } from './token.revoke'

export default new Module(({ get, post }) => {
  get('/auth/config').use(getAuthConfig).openapi({
    tags: 'auth',
    operationId: 'getAuthConfig'
  })

  post('/auth/email').use(authWithEmail).openapi({
    tags: 'auth',
    operationId: 'authByEmail'
  })

  post('/auth/token/revoke').auth(revokeToken).openapi({
    tags: 'auth',
    operationId: 'authRevoke'
  })
})
