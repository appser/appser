import { createErrors, t } from '../error'

export const serverError = createErrors('common', {
  invalidParameter: ['BadRequest', t('common.invalidParameter')],
  unknown: ['InternalServerError', t('common.unknown')],
  internal: ['InternalServerError', t('common.internal')],
  invalidRequest: ['NotFound', t('common.invalidRequest')],
  notFound: ['NotFound', t('common.notFound')],
  accessForbidden: ['Forbidden', t('common.accessForbidden')]
})
