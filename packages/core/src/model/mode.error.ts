import { createErrors, t } from 'core/error'

export const modelError = createErrors('model', {
  validateFail: ['Forbidden', t('model.validateFail')],
  invalidInsertType: ['Forbidden', t('model.invalidInsertType')],
  invalidUpdateType: ['Forbidden', t('model.invalidUpdateType')],
  notFound: ['NotFound', t('model.notFound')],
  columnIsFrozen: ['Forbidden', t('model.columnIsLocked')],
  patchColumnFailed: ['Forbidden', t('model.patchColumnFailed')],
  invalidColumnConfig: ['Forbidden', t('model.invalidColumnConfig')],
  columnNotFound: ['BadRequest', t('model.columnNotFound')],
  castColumnFailed: ['BadRequest', t('model.castColumnFailed')],
  invalidColumnOptions: ['BadRequest', t('model.invalidColumnOptions')],
  missingTableWName: ['Forbidden', t('model.missingTableWName')]
})
