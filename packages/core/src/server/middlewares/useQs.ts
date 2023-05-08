import { qs } from '@appser/common'
import merge from 'merge-descriptors'

import type { Middleware } from 'koa'

export const useQs: Middleware = async (ctx, next) => {
  merge(ctx.app.request, {

    /**
     * Get parsed query-string.
     *
     * @return {Object}
     * @api public
     */
    get query() {
      const str = this.querystring

      if (!str) return {}

      const c = this._queryCache = this._queryCache || {}
      let query = c[str]

      if (!query) {
        c[str] = query = qs.parse(str)
      }

      return query
    },

    /**
     * Set query-string as an object.
     *
     * @param {Object} obj
     * @api public
     */
    set query(obj) {
      this.querystring = qs.stringify(obj)
    }
  } as any)

  await next()
}
