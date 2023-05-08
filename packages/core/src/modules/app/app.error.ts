import { createErrors, t } from 'core/error'

export const appError = createErrors('app', {
  notFound: ['NotFound', t('app.notFound')],
  unavailableRole: ['Forbidden', t('app.unavailableRole')]
})
