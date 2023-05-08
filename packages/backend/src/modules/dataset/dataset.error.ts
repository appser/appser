import { createErrors, t } from 'backend/error'

export const datasetError = createErrors('dataset', {
  fieldIsLocked: ['Forbidden', t('model.fieldIsLocked')],
  invalidRecordField: ['Forbidden', t('dataset.invalidRecordField')],
  invalidField: ['Forbidden', t('dataset.invalidField')],
  recordNotFound: ['Forbidden', t('dataset.recordNotFound')],
  invalidRecord: ['Forbidden', t('dataset.invalidRecord')],
  viewRequired: ['Forbidden', t('dataset.viewRequired')],
  viewNotFound: ['Forbidden', t('dataset.viewNotFound')],
  viewFieldNotFound: ['Forbidden', t('dataset.viewFieldNotFound')],
  invalidView: ['Forbidden', t('dataset.invalidView')],
  notFound: ['Forbidden', t('dataset.notFound')],
  fieldNotFound: ['NotFound', t('dataset.fieldNotFound')],
  invalidFilterQuery: ['BadRequest', t('dataset.invalidFilterQuery')],
  selectOutsideField: ['BadRequest', t('dataset.selectOutsideField')],
  invalidOperator: ['BadRequest', t('dataset.invalidOperator')]
})
