import { baseKrm } from './fixtures/router/middleware'
import { fullSchema } from './fixtures/router/schema'
import RouterMiddleware from '../middleware'

describe('class RouterMiddleware', () => {
  describe('.requestJsonSchema', () => {
    test('should be undefined', () => {
      expect(new RouterMiddleware(baseKrm).requestSchema).toBeUndefined()
    })
  })

  describe('.koaRouterMiddlewares', () => {
    test('length should return 1', () => {
      expect(new RouterMiddleware(baseKrm).koaRouterMiddleware.length).toBe(1)
      expect(
        new RouterMiddleware(baseKrm, {
          // @ts-expect-error
          some: fullSchema.other
        }).koaRouterMiddleware.length
      ).toBe(1)
    })

    test('length should return 2', () => {
      expect(
        new RouterMiddleware(baseKrm, {
          state: fullSchema.state
        }).koaRouterMiddleware.length
      ).toBe(2)
      expect(
        new RouterMiddleware(baseKrm, {
          query: fullSchema.query
        }).koaRouterMiddleware.length
      ).toBe(2)
    })

    test('length should return 3', () => {
      expect(
        new RouterMiddleware(baseKrm, {
          state: fullSchema.state,
          body: fullSchema.body
        }).koaRouterMiddleware.length
      ).toBe(3)
    })
  })
})
