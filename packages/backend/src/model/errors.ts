import { createErrors, t } from 'backend/error'

export const modelError = createErrors('model', {
  validateFail: ['Forbidden', t('model.validateFail')],
  invalidInsertType: ['Forbidden', t('model.invalidInsertType')],
  invalidUpdateType: ['Forbidden', t('model.invalidUpdateType')],
  notFound: ['NotFound', t('model.notFound')],
  columnIsFrozen: ['Forbidden', t('model.columnIsLocked')],
  patchFieldFailed: ['Forbidden', t('model.patchFieldFailed')],
  invalidColumnConfig: ['Forbidden', t('model.invalidColumnConfig')],
  columnNotFound: ['BadRequest', t('model.columnNotFound')],
  castFieldFailed: ['BadRequest', t('model.castFieldFailed')],
  invalidFieldOptions: ['BadRequest', t('model.invalidFieldOptions')],
  missingTableWName: ['Forbidden', t('model.missingTableWName')]
})
