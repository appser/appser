import { validateViewColumns } from '../validateViewColumns'

import type { TView } from 'backend/models/dataset/view.schema'

describe('validateView', () => {
  const validView: TView = {
    id: '1',
    name: 'My View',
    type: 'grid',
    columns: ['col1', 'col2'],
    sorts: ['col1', '-col2'],
    column: {
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
    stickyColumn: 1
  }
  const availableColumnNames = ['col1', 'col2']

  test('returns true for a valid view', () => {
    expect(validateViewColumns(validView, availableColumnNames)).toBe(true)
  })

  test('returns false when a column is not available', () => {
    const invalidView: TView = {
      ...validView,
      columns: ['col1', 'col3'] // col3 is not an available column
    }

    expect(validateViewColumns(invalidView, availableColumnNames)).toBe(false)
  })

  test('returns false when a sort column is not available', () => {
    const invalidView: TView = {
      ...validView,
      sorts: ['col1', '-col3'] // col3 is not an available column
    }
    expect(validateViewColumns(invalidView, availableColumnNames)).toBe(false)
  })

  test('returns false when a filter column is not available', () => {
    const invalidView: TView = {
      ...validView,
      filter: {
        and: [
          {
            col3: { // col3 is not an available column
              gt: '123'
            }
          }
        ]
      }
    }
    expect(validateViewColumns(invalidView, availableColumnNames)).toBe(false)
  })

  test('returns false when the sticky column is out of range', () => {
    const invalidView: TView = {
      ...validView,
      stickyColumn: 2 // there are only 2 columns available
    }
    expect(validateViewColumns(invalidView, availableColumnNames)).toBe(false)
  })
})
