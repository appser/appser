import { View } from '../../helpers/view/view'

import type { TDataset } from 'core/models/dataset'
import type { TView } from 'core/modules/dataset/helpers/view/view.schema'

describe('class View', () => {
  let view: View
  let config: TView
  let dataset: Pick<TDataset, 'field'>

  beforeEach(() => {
    config = {
      id: '1',
      name: 'View 1',
      type: 'sheet',
      field: {
        field1: { width: 100, selected: true },
        field2: { width: 150, selected: false }
      },
      fields: ['field1', 'field2'],
      sorts: ['field1', '-field2'],
      filter: {
        and: [
          { field1: { eq: 'value1' } },
          { field2: { eq: 'value2' } }
        ]
      },
      stickyField: 0
    }

    dataset = {
      field: {
        field1: { type: 'simpleText' },
        field2: { type: 'simpleText' },
        field3: { type: 'simpleText' }
      }
    }

    view = new View(config, dataset)
  })

  test('.update', () => {
    const expectedView = {
      ...config,
      sorts: ['field1', 'field2']
    }

    expect(view.updateConfig({ sorts: ['field1', 'field2'] }).toJSON()).toEqual(expectedView)
  })

  describe('.isValidate', () => {
    test('returns true for a valid view', () => {
      expect(view.validateConfig({ field: { field3: { selected: true } } })).toBe(true)
    })

    test('returns false when a field is not available', () => {
      expect(view.validateConfig({ field: { field4: { selected: true } } })).toBe(false)
    })

    test('returns false when a sort field is not available', () => {
      expect(view.validateConfig({ sorts: ['col1'] })).toBe(false)
    })

    test('returns false when a filter field is not available', () => {
      const invalidFilter = {
        and: [
          {
            col3: { // col3 is not an available field
              gt: '123'
            }
          }
        ]
      }
      expect(view.validateConfig({ filter: invalidFilter })).toBe(false)
    })

    test('returns false when the sticky field is out of range', () => {
      expect(view.validateConfig({ stickyField: 2 })).toBe(false)
    })
  })

  describe('.cleanField', () => {
    test('should remove field from view.field', () => {
      const fieldName = 'field1'
      const expectedView = {
        ...config,
        field: {
          field2: { width: 150, selected: false }
        },
        fields: ['field2'],
        sorts: ['-field2']
      }
      expect(view.cleanField(fieldName).toJSON()).toEqual(expectedView)
    })

    test('should remove field from view.filter.and', () => {
      const fieldName = 'field1'
      const expectedView = {
        ...config,
        field: {
          field2: { width: 150, selected: false }
        },
        filter: {
          and: [{ field2: { eq: 'value2' } }]
        },
        fields: ['field2'],
        sorts: ['-field2']
      }
      expect(view.cleanField(fieldName).toJSON()).toEqual(expectedView)
    })

    test('should remove field from view.filter.or', () => {
      const fieldName = 'field2'
      const expectedView = {
        ...config,
        field: {
          field1: { width: 100, selected: true }
        },
        filter: {
          and: [{ field1: { eq: 'value1' } }]
        },
        fields: ['field1'],
        sorts: ['field1']
      }
      expect(view.cleanField(fieldName).toJSON()).toEqual(expectedView)
    })

    test('should remove field from view.fields', () => {
      const fieldName = 'field1'
      const expectedView = {
        ...config,
        field: {
          field2: { width: 150, selected: false }
        },
        fields: ['field2'],
        sorts: ['-field2']
      }
      expect(view.cleanField(fieldName).toJSON()).toEqual(expectedView)
    })

    test('should remove field from view.sorts', () => {
      const fieldName = 'field1'
      const expectedView = {
        ...config,
        field: {
          field2: { width: 150, selected: false }
        },
        fields: ['field2'],
        sorts: ['-field2']
      }
      expect(view.cleanField(fieldName).toJSON()).toEqual(expectedView)
    })
  })
})
