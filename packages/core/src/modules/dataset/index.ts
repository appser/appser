import { useFormula } from 'backend/formula/useFormula'
import { Module } from 'backend/server/module'

import { addField } from './field.add'
import { deleteField } from './field.delete'
import { getField } from './field.get'
import { updateField } from './field.update'
import { getDataset } from './get'
import { deleteRecord } from './record.delete'
import { updateDataset } from './update'
import { addView } from './view.add'
import { deleteView } from './view.delete'
import { getView } from './view.get'
import { addViewRecord } from './view.record.add'
import { getViewRecord } from './view.record.get'
import { queryRecord } from './view.record.query'
import { updateViewRecord } from './view.record.update'
import { updateView } from './view.update'

export default new Module(({ get, post, del, patch, put }) => {
  get('/datasets/:datasetId').access(getDataset).openapi({
    tags: 'dataset',
    operationId: 'getDataset'
  })

  patch('/datasets/:datasetId').access(getDataset, updateDataset).openapi({
    tags: 'dataset',
    operationId: 'updateDataset'
  })

  /** field */
  post('/datasets/:datasetId/fields').access(getDataset, addField).openapi({
    tags: 'dataset',
    operationId: 'addField'
  })

  del('/datasets/:datasetId/fields/:fieldName').access(getDataset, getField, deleteField).openapi({
    tags: 'dataset',
    operationId: 'deleteField'
  })

  patch('/datasets/:datasetId/fields/:fieldName').access(getDataset, getField, updateField).openapi({
    tags: 'dataset',
    operationId: 'updateField'
  })

  /** view */
  get('/datasets/:datasetId/views/:viewId').access(getDataset, getView).openapi({
    tags: 'dataset',
    operationId: 'getView'
  })

  post('/datasets/:datasetId/views').access(getDataset, addView).openapi({
    tags: 'dataset',
    operationId: 'addView'
  })

  patch('/datasets/:datasetId/views/:viewId').access(getDataset, getView, updateView).openapi({
    tags: 'dataset',
    operationId: 'updateView'
  })

  del('/datasets/:datasetId/views/:viewId').access(getDataset, getView, deleteView).openapi({
    tags: 'dataset',
    operationId: 'deleteView'
  })

  /** record */
  post('/datasets/:datasetId/views/:viewId/records').access(getDataset, getView, addViewRecord).openapi({
    tags: 'dataset',
    operationId: 'addRecord'
  })

  // Query method request can be used in the future
  post('/datasets/:datasetId/views/:viewId/records/query').access(useFormula, getDataset, getView, queryRecord).openapi({
    tags: 'dataset',
    operationId: 'queryRecord'
  })

  get('/datasets/:datasetId/views/:viewId/records/:recordId').access(getDataset, getView, getViewRecord).openapi({
    tags: 'dataset',
    operationId: 'getRecord'
  })

  patch('/datasets/:datasetId/views/:viewId/records/:recordId').access(getDataset, getView, getViewRecord, updateViewRecord).openapi({
    tags: 'dataset',
    operationId: 'updateRecord'
  })

  del('/datasets/:datasetId/records/:recordId').access(getDataset, deleteRecord).openapi({
    tags: 'dataset',
    operationId: 'deleteRecord'
  })
})