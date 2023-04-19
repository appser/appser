import { rules } from './data/rules'

const servers = [
  'account',
  'org',
  'app'
] as const

export const actions = Object.keys(rules) as [string, ...string[]]

export type Action = keyof typeof rules

export type FuzzyAction = `${typeof servers[number]}:*` | Action
