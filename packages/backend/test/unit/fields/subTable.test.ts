import 'packages/database/src/fields/subTable'

import Model from 'src/access'

describe('subTable field', () => {
  const model = new Model({
    json: {
      field: 'subTable',
      options: {
        schema: {
          type: 'object',
          properties: {
            foo: { type: 'string' }
          },
          required: ['foo'],
          additionalProperties: false
        }
      }
    }
  })

  test('should be throw schema validate error', () => {
    expect(() => model.onInsert({ json: {} })).toThrow()
  })

  test('should be validated success', () => {
    expect(
      model.onInsert({
        json: {
          foo: 'bar',
          baz: 'qux'
        }
      })
    ).toEqual({ json: { foo: 'bar' } })
  })

  test('insert any object', () => {
    expect(
      new Model({
        json: { field: 'subTable', options: { schema: { type: 'object', required: [] } } }
      }).onInsert({ json: { a: 1 } })
    ).toEqual({ json: { a: 1 } })
  })
})
