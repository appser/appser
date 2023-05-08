import isPlainObject from 'lodash/isPlainObject'
import set from 'lodash/set'

import { camelCase } from './camelCase'

export function processResponse(result: unknown): unknown {
  if (Array.isArray(result)) {
    return result.map(processResponse)
  } else if (isPlainObject(result)) {
    return Object.entries(result as object).reduce<Record<string, unknown>>((acc, [k, v]) => {
      // remove null values
      if (v === null || v === undefined) return acc

      // camelCase keys
      // dot path to object
      return set(acc, camelCase(k), processResponse(v))
    }, {})
  } else {
    return result
  }
}
