import { createErrors, t } from 'core/error'

export const dbError = createErrors('db', {
  invalidFilter: ['Forbidden', t('db.invalidFilter')]
})
