import { filter } from './match'
import { rules } from '../data/rules'
import { actions as allActions } from '../action'

import type { Action } from '../action'
import type { Policy } from '../policy'

export function validatePolicy({ action, resource }: Policy) {
  if (!resource) return false
  const matchedActions = filter(allActions, action) as Action[]

  if (matchedActions.length === 0) {
    throw new Error('The action is not defined in the rules.')
  }

  const policyResourceKeys = Object.keys(resource)

  const hasResource = matchedActions.every(action => {
    const ruleResourceKeys = rules[action] as unknown as string[]

    return ruleResourceKeys.every(key => policyResourceKeys.includes(key))
  })

  if (!hasResource) {
    throw new Error(`[${matchedActions.join(',')}] not match the resource [${JSON.stringify(resource)}].`)
  }

  return hasResource
}
