import { createErrors, t } from 'backend/error'

export const orgError = createErrors('org', {
  notFound: ['NotFound', t('org.notFound')],
  peopleNotFound: ['Forbidden', t('org.peopleNotFound')],
  peopleRemoveSelf: ['Forbidden', t('org.peopleRemoveSelf')],
  mustHaveOneOwner: ['Forbidden', t('org.mustHaveOneOwner')],
  unavailableRole: ['Forbidden', t('org.unavailableRole')],
  cannotChangeSelfRole: ['Forbidden', t('org.cannotChangeSelfRole')]
})
