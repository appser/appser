import Permission from './permission'
import { validatePolicy } from './utils/validatePolicy'

import type { Action } from './action'
import type { rules } from './data/rules'
import type { Policy } from './policy'

export default class Access {
  policies: Policy[] = []

  constructor(policy?: Policy | Policy[]) {
    if (policy) {
      Array.isArray(policy) ? policy.forEach(policy => this.grant(policy)) : this.grant(policy)
    }
  }

  grant(policy: Policy) {
    validatePolicy(policy)

    this.policies.push(policy)

    return this
  }

  can<T extends Action>(action: T, resource: Record<(typeof rules)[T][number], string>, attributes?: string[]) {
    return new Permission(this, action, resource, attributes)
  }
}

export { Permission, Policy }
export * from './data/roles'
