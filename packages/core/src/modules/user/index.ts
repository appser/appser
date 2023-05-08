import { getUser } from 'backend/modules/user/user.get'
import { Module } from 'backend/server/module'

export default new Module(({ get }) => {
  get('/users/:userId').access(getUser).openapi({
    tags: 'user',
    operationId: 'getUser'
  })
})
