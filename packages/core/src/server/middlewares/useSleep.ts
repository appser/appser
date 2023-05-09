/**
 * Mock slow network for web development
 */

import sleep from '../utils/sleep'

import type { Middleware } from 'koa'

export function useSleep(n: number): Middleware {
  return async function (ctx, next) {
    await sleep(n)

    return next()
  }
}
