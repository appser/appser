import { createErrors, t } from 'backend/error'

export const accountError = createErrors('account', {
  incorrectPassword: ['NotFound', t('account.incorrectPassword')]
})
