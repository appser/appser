import 'backend/fields/singleRelation'

import Model from 'src/access'
import Field from 'src/field'

describe('relation field', () => {
  const relation = new Model({
    foo: { field: 'relation' }
  })

  test('should be empty', () => {
    expect(relation.onInsert({})).toEqual({})
  })

  test('should be array', () => {
    expect(relation.onInsert({ foo: ['123'] })).toEqual({ foo: ['123'] })
  })

  test('should pass int64 format', () => {
    expect(relation.onInsert({ foo: [123] })).toEqual({ foo: ['123'] })
    expect(relation.onInsert({ foo: ['18446744073709551615'] })).toEqual({ foo: ['18446744073709551615'] })
  })

  test('relation options', () => {
    const relation2 = new Model({
      foo: { field: 'relation', options: { multiple: true } }
    })
    expect(relation2.onInsert({ foo: ['123', '123'] })).toEqual({ foo: ['123', '123'] })
  })
})
