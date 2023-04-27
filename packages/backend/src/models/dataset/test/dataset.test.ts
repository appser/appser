import set from 'lodash/set'

import { viewSchema } from '../view.schema'

describe('view schema', () => {
  const schema = {
    id: '123',
    column: {
      id: {
        width: 100
      }
    },
    selects: ['id']
  }

  test('should parse work', () => {
    expect(() => viewSchema.parse(schema)).not.toThrowError()
    expect(() => viewSchema.parse(set(schema, 'sorts', ['-id']))).not.toThrowError()
    expect(() => viewSchema.parse(set(schema, 'filter', { id: { gt: 1 } }))).not.toThrowError()
    expect(() => viewSchema.parse(set(schema, 'selects', ['-id']))).not.toThrowError()
    expect(() => viewSchema.parse(set(schema, 'stickyColumn', 0))).not.toThrowError()
  })

  test('should parse fail when column is not match', () => {
    expect(() => viewSchema.parse(set(schema, 'sorts', ['id2']))).toThrowError()
    expect(() => viewSchema.parse(set(schema, 'filter', { nid: { gt: 1 } }))).toThrowError()
    expect(() => viewSchema.parse(set(schema, 'selects', ['nid']))).toThrowError()
    expect(() => viewSchema.parse(set(schema, 'stickyColumn', 111))).toThrowError()
  })
})
