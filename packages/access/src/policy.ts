import type { FuzzyAction } from './action'

export interface Policy {
  action: FuzzyAction | FuzzyAction[] | string | string[]
  resource: Record<string, string | string[]>
  attributes?: string[]
  effect?: 'allow' | 'deny'
  role?: string
}
