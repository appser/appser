import 'packages/database/src/fields/number'

import { Model } from '@appser/model'

describe('number field', () => {
  const number = new Model('test', {
    num: { field: 'numId' }
  })

  const numberHasDefault = new Model('test', {
    num: { field: 'number', options: { default: 1 } }
  })

  test('should be empty', () => {
    expect(number.onInsert({})).toEqual({})
  })

  test('should set to default value', () => {
    expect(numberHasDefault.onInsert({})).toEqual({ num: 1 })
  })
})
