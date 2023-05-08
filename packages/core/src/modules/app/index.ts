import { Module } from 'backend/server/module'

import { createAppDataset } from './dataset.create'
import { deleteApp } from './delete'
import { getApp } from './get'
import { addAppPeople } from './people.add'
import { listAppPeople } from './people.list'
import { listAppRole } from './role.list'
import { updateApp } from './update'

export default new Module(({ get, post, del, patch }) => {
  get('/apps/:appId').access(getApp).openapi({
    tags: 'app',
    operationId: 'getApp'
  })

  get('/apps/:appId/people').access(listAppPeople).openapi({
    tags: 'app',
    operationId: 'listAppPeople'
  })

  post('/apps/:appId/datasets').access(createAppDataset).openapi({
    tags: 'app',
    operationId: 'createDataset'
  })

  post('/apps/:appId/people').access(getApp, addAppPeople).openapi({
    tags: 'app',
    operationId: 'addAppPeople'
  })

  del('/apps/:appId').access(deleteApp).openapi({
    tags: 'app',
    operationId: 'deleteApp'
  })

  patch('/apps/:appId').access(updateApp).openapi({
    tags: 'app',
    operationId: 'updateApp'
  })

  get('/apps/:appId/roles').access(listAppRole).openapi({
    tags: 'app',
    operationId: 'listAppRole'
  })
})
