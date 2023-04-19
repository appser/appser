import { createErrors, t } from 'backend/error'

export const dbError = createErrors('db', {
  invalidFilter: ['Forbidden', t('db.invalidFilter')]
})
