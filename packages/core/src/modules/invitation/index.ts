import { Module } from 'backend/server/module'

import { acceptInvitation } from './accept'
import { getInvitation } from './get'

export default new Module(({ get, post }) => {
  get('/invitation').use(getInvitation).openapi({
    tags: 'invite',
    operationId: 'getInvitation'
  })

  post('/invite/accept').access(acceptInvitation).openapi({
    tags: 'invite',
    operationId: 'acceptInvitation'
  })
})
