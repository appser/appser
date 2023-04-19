import { createErrors, t } from 'backend/error'

export const datasetError = createErrors('dataset', {
  columnIsLocked: ['Forbidden', t('model.columnIsLocked')],
  invalidRecordColumn: ['Forbidden', t('dataset.invalidRecordColumn')],
  invalidColumn: ['Forbidden', t('dataset.invalidColumn')],
  recordNotFound: ['Forbidden', t('dataset.recordNotFound')],
  invalidRecord: ['Forbidden', t('dataset.invalidRecord')],
  viewRequired: ['Forbidden', t('dataset.viewRequired')],
  viewNotFound: ['Forbidden', t('dataset.viewNotFound')],
  viewColumnNotFound: ['Forbidden', t('dataset.viewColumnNotFound')],
  invalidView: ['Forbidden', t('dataset.invalidView')],
  notFound: ['Forbidden', t('dataset.notFound')],
  invalidFilterQuery: ['BadRequest', t('dataset.invalidFilterQuery')],
  selectOutsideColumn: ['BadRequest', t('dataset.selectOutsideColumn')],
  invalidOperator: ['BadRequest', t('dataset.invalidOperator')]
})
