import request from 'supertest'

import Apiser from '../apiser'

const apiser = new Apiser()

describe('class Router', () => {
  test('should throw error if use invalid middleware', () => {
    expect(() => apiser.get('/test', 1)).toThrow()
    expect(() => apiser.get('/test', true)).toThrow()
  })

  /*
  test('should not found router', () => {
    return request(apiser.listen()).get('/').expect(404)
  })
  */
})
