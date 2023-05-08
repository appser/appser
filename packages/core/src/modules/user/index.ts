import { getUser } from 'core/modules/user/user.get'
import { Module } from 'core/server/module'

export default new Module(({ get }) => {
  get('/users/:userId').access(getUser).openapi({
    tags: 'user',
    operationId: 'getUser'
  })
})
