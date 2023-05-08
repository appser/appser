import { validateViewFields } from '../../helpers/validateViewFields'

import type { TView } from 'core/models/dataset/view.schema'

describe('validateView', () => {
  const validView: TView = {
    id: '1',
    name: 'My View',
    type: 'sheet',
    fields: ['col1', 'col2'],
    sorts: ['col1', '-col2'],
    field: {
      col1: {
        width: 100
      },
      col2: {
        width: 100
      }
    },
    filter: {
      and: [
        {
          col: {
            gt: '123'
          }
        }
      ]
    },
    stickyField: 1
  }
  const availableColumnNames = ['col1', 'col2']

  test('returns true for a valid view', () => {
    expect(validateViewFields(validView, availableColumnNames)).toBe(true)
  })

  test('returns false when a field is not available', () => {
    const invalidView: TView = {
      ...validView,
      fields: ['col1', 'col3'] // col3 is not an available field
    }

    expect(validateViewFields(invalidView, availableColumnNames)).toBe(false)
  })

  test('returns false when a sort field is not available', () => {
    const invalidView: TView = {
      ...validView,
      sorts: ['col1', '-col3'] // col3 is not an available field
    }
    expect(validateViewFields(invalidView, availableColumnNames)).toBe(false)
  })

  test('returns false when a filter field is not available', () => {
    const invalidView: TView = {
      ...validView,
      filter: {
        and: [
          {
            col3: { // col3 is not an available field
              gt: '123'
            }
          }
        ]
      }
    }
    expect(validateViewFields(invalidView, availableColumnNames)).toBe(false)
  })

  test('returns false when the sticky field is out of range', () => {
    const invalidView: TView = {
      ...validView,
      stickyField: 2 // there are only 2 fields available
    }
    expect(validateViewFields(invalidView, availableColumnNames)).toBe(false)
  })
})
