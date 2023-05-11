import { processResponse } from 'core/db/helpers/processResponse'

describe('processResponse', () => {
  test('remove null values', () => {
    expect(processResponse({ a: null, b: 1 })).toEqual({ b: 1 })
    expect(processResponse({ a: null, b: 1, c: { d: null, e: 2 } })).toEqual({ b: 1, c: { e: 2 } })
    expect(processResponse({ a: null, b: 1, c: [{ d: null, e: 2 }] })).toEqual({ b: 1, c: [{ e: 2 }] })
  })

  test('camelCase keys', () => {
    expect(processResponse({ a_b: 1 })).toEqual({ aB: 1 })
    expect(processResponse({ a_b: 1, c_d: { e_f: 2 } })).toEqual({ aB: 1, cD: { eF: 2 } })
    expect(processResponse({ a_b: 1, c_d: [{ e_f: 2 }] })).toEqual({ aB: 1, cD: [{ eF: 2 }] })
  })

  test('dot path to object', () => {
    expect(processResponse({ 'a.b': 1 })).toEqual({ a: { b: 1 } })
    expect(processResponse({ 'a.b': 1, 'c.d.e': 2 })).toEqual({ a: { b: 1 }, c: { d: { e: 2 } } })
    expect(processResponse({ 'a.b': 1, 'c.d.e': [{ f: 2 }] })).toEqual({ a: { b: 1 }, c: { d: { e: [{ f: 2 }] } } })
  })
})
