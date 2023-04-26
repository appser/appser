import cleanViewColumn from '../cleanViewColumn'

import type { TView } from 'backend/models/dataset/view.schema'

describe('func cleanViewColumn', () => {
  let view: TView

  beforeEach(() => {
    view = {
      id: '1',
      name: 'View 1',
      type: 'grid',
      column: {
        column1: {
          width: 100,
          selected: true
        },
        column2: {
          width: 150,
          selected: false
        }
      },
      columns: ['column1', 'column2'],
      sorts: ['column1', '-column2'],
      filter: {
        and: [
          {
            column1: {
              eq: 'value1'
            }
          },
          {
            column2: {
              eq: 'value2'
            }
          }
        ]
      },
      stickyColumn: 0
    }
  })

  test('should remove column from view.column', () => {
    const columnName = 'column1'
    const expectedView = {
      ...view,
      column: {
        column2: {
          width: 150,
          selected: false
        }
      },
      columns: ['column2'],
      sorts: ['-column2']
    }
    expect(cleanViewColumn(view, columnName)).toEqual(expectedView)
  })

  test('should remove column from view.filter.and', () => {
    const columnName = 'column1'
    const expectedView = {
      ...view,
      column: {
        column2: {
          width: 150,
          selected: false
        }
      },
      filter: {
        and: [
          {
            column2: {
              eq: 'value2'
            }
          }
        ]
      },
      columns: ['column2'],
      sorts: ['-column2']
    }
    expect(cleanViewColumn(view, columnName)).toEqual(expectedView)
  })

  test('should remove column from view.filter.or', () => {
    const columnName = 'column2'
    const expectedView = {
      ...view,
      column: {
        column1: {
          width: 100,
          selected: true
        }
      },
      filter: {
        and: [
          {
            column1: {
              eq: 'value1'
            }
          }
        ]
      },
      columns: ['column1'],
      sorts: ['column1']
    }
    expect(cleanViewColumn(view, columnName)).toEqual(expectedView)
  })

  test('should remove column from view.columns', () => {
    const columnName = 'column1'
    const expectedView = {
      ...view,
      column: {
        column2: {
          width: 150,
          selected: false
        }
      },
      columns: ['column2'],
      sorts: ['-column2']
    }
    expect(cleanViewColumn(view, columnName)).toEqual(expectedView)
  })

  test('should remove column from view.sorts', () => {
    const columnName = 'column1'
    const expectedView = {
      ...view,
      column: {
        column2: {
          width: 150,
          selected: false
        }
      },
      columns: ['column2'],
      sorts: ['-column2']
    }
    expect(cleanViewColumn(view, columnName)).toEqual(expectedView)
  })
})
