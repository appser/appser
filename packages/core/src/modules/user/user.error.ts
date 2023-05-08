import { createErrors, t } from 'backend/error'

export const userError = createErrors('user', {
  notFound: ['NotFound', t('user.notFound')]
})
