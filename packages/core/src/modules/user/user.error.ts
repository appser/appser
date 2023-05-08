import { createErrors, t } from 'core/error'

export const userError = createErrors('user', {
  notFound: ['NotFound', t('user.notFound')]
})
