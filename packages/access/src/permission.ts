import Debug from 'debug'
import union from 'lodash/union'

import { filter, isMatchObject, isMatchString } from './utils/match'

import type Access from '.'
import type { Policy } from './policy'

const debug = Debug('appser:access')

type Resource = Record<string, string>

export default class Permission {
  matched

  constructor(private access: Access, action: string, resource: Resource, attributes?: string[]) {
    this.access = access
    this.matched = this.match(action, resource, attributes)

    debug(
      `${this.matched.length === 0 ? '[deny]' : '[allow]'}, giving %o`,
      { action, resource }
    )
  }

  get allow() {
    const isDeny = this.matched.some(policy => policy.effect === 'deny')

    return !isDeny && this.matched.length > 0
  }

  get deny() {
    return !this.allow
  }

  get attributes() {
    if (!this.allow) return []

    return union(...this.matched.map(p => p.attributes ?? ['*']))
  }

  match(action: string, resource: Resource, attributes?: string[]) {
    return this.access.policies.filter(
      policy =>
        this.isMatchAction(policy, action) &&
        this.isMatchResource(policy, resource) &&
        this.isMatchAttributes(policy, attributes)
    )
  }

  private isMatchAction(policy: Policy, action: string) {
    return isMatchString(action, policy.action)
  }

  private isMatchResource(policy: Policy, resource: Resource) {
    return isMatchObject(resource, policy.resource)
  }

  private isMatchAttributes(policy: Policy, attributes?: string[]) {
    if (!attributes) return true
    if (!policy.attributes) return true

    return filter(attributes, policy.attributes).length === attributes.length
  }
}
