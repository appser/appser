import { isPlainObject } from 'lodash'

type NestedObject = Record<string, any>

export default function flattenObject(obj: NestedObject, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {}

  for (const key in obj) {
    const propName = prefix ? `${prefix}.${key}` : key

    if (isPlainObject(obj[key]) || Array.isArray(obj[key])) {
      Object.assign(result, flattenObject(obj[key], propName))
    } else {
      result[propName] = obj[key]
    }
  }

  return result
}
