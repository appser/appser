import { createErrors, t } from 'backend/error'

export const appError = createErrors('app', {
  notFound: ['NotFound', t('app.notFound')],
  unavailableRole: ['Forbidden', t('app.unavailableRole')]
})
