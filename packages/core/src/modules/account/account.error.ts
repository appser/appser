import { createErrors, t } from 'core/error'

export const accountError = createErrors('account', {
  incorrectPassword: ['NotFound', t('account.incorrectPassword')]
})
