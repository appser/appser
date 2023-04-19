import translation from '@appser/languages/en/error.json'
import { HttpStatusCode } from '@appser/shared'
import createError from 'http-errors'
import get from 'lodash/get'

interface Error {
  [key: string]: [keyof typeof HttpStatusCode, string]
}

export const t = (key: string) => get(translation, key) || key

export function createErrors<T extends Error>(path: string, errors: T) {
  return function (code: keyof T, detail?: unknown) {
    const [status, message] = errors[code]

    return createError(HttpStatusCode[status], message, {
      code: [path, code].join('.'),
      detail
    })
  }
}
