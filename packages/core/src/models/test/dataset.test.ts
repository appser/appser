import { viewSchema } from 'core/modules/dataset/helpers/view/view.schema'
import set from 'lodash/set'

describe('view schema', () => {
  const schema = {
    id: '123',
    field: {
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
    expect(() => viewSchema.parse(set(schema, 'stickyField', 0))).not.toThrowError()
  })

  test('should parse fail when field is not match', () => {
    expect(() => viewSchema.parse(set(schema, 'sorts', ['id2']))).toThrowError()
    expect(() => viewSchema.parse(set(schema, 'filter', { nid: { gt: 1 } }))).toThrowError()
    expect(() => viewSchema.parse(set(schema, 'selects', ['nid']))).toThrowError()
    expect(() => viewSchema.parse(set(schema, 'stickyField', 111))).toThrowError()
  })
})
