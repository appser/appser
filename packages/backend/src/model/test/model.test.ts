import { z } from 'zod'

import { Model } from '..'

const model = new Model({
  account: { field: 'account', options: { grantRoleId: '123' } },
  checkbox: { field: 'checkbox' },
  date: { field: 'date' },
  file: { field: 'file' },
  number: { field: 'number', isRequired: true },
  numId: { field: 'numId' },
  select: { field: 'select', options: { items: { a: 1, b: 2, c: 3 } } },
  subTable: {
    field: 'custom',
    schema: z.object({
      subText: z.string()
    })
  },
  text: { field: 'simpleText', options: { match: ['a', 'b', 'c'] } },
  url: { field: 'url' }
})

describe('Model', () => {
  test('should create a model', () => {
    expect(model).toBeTruthy()
  })

  test('should require a field', () => {
    expect(() => model.parseInserts({})).toThrowError()
    expect(() => model.parseInserts(null)).toThrowError()
    expect(() => model.parseInserts(1)).toThrowError()
    expect(() => model.parseInserts(true)).toThrowError()
    expect(model.parseInserts({ number: 1 })).toEqual({ number: 1 })
  })

  test('invalid field base type', () => {
    expect(() => model.parseInserts({ invalid: 1 })).toThrowError()
    expect(() => model.parseInserts({ number: 'a' })).toThrowError()
    expect(() => model.parseInserts({
      number: 1,
      subTable: {
        subText: 1
      }
    })).toThrowError()
  })

  test('invalid field option', () => {
    expect(model.parseInserts({ number: 1 })).toEqual({ number: 1 })
    expect(() => model.parseInserts({ number: 1, text: 'd' })).toThrowError()
  })

  test('transform response', () => {
    expect(model.transformResponse({ text: 'a' })).toEqual({ text: 'a' })
    expect(model.transformResponse({
      text: 'a',
      subTable: { subText: 'b' }
    })).toEqual({ text: 'a', subTable: { subText: 'b' } })
    expect(model.transformResponse({
      account: { password: 'a' }
    })).toEqual({ account: { password: '********' } })
  })

  test('default value', () => {
    const model = new Model({
      numId: { field: 'numId', options: { dynamicDefault: 'snowflakeId' } }
    })

    // expect(model.parseInserts({})).not.empty()
  })
})
