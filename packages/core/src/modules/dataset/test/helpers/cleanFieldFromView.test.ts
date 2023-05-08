import cleanFieldFromView from '../../helpers/cleanFieldFromView'

import type { TView } from 'backend/models/dataset/view.schema'

describe('func cleanViewField', () => {
  let view: TView

  beforeEach(() => {
    view = {
      id: '1',
      name: 'View 1',
      type: 'sheet',
      field: {
        field1: {
          width: 100,
          selected: true
        },
        field2: {
          width: 150,
          selected: false
        }
      },
      fields: ['field1', 'field2'],
      sorts: ['field1', '-field2'],
      filter: {
        and: [
          {
            field1: {
              eq: 'value1'
            }
          },
          {
            field2: {
              eq: 'value2'
            }
          }
        ]
      },
      stickyField: 0
    }
  })

  test('should remove field from view.field', () => {
    const fieldName = 'field1'
    const expectedView = {
      ...view,
      field: {
        field2: {
          width: 150,
          selected: false
        }
      },
      fields: ['field2'],
      sorts: ['-field2']
    }
    expect(cleanFieldFromView(fieldName, view)).toEqual(expectedView)
  })

  test('should remove field from view.filter.and', () => {
    const fieldName = 'field1'
    const expectedView = {
      ...view,
      field: {
        field2: {
          width: 150,
          selected: false
        }
      },
      filter: {
        and: [
          {
            field2: {
              eq: 'value2'
            }
          }
        ]
      },
      fields: ['field2'],
      sorts: ['-field2']
    }
    expect(cleanFieldFromView(fieldName, view)).toEqual(expectedView)
  })

  test('should remove field from view.filter.or', () => {
    const fieldName = 'field2'
    const expectedView = {
      ...view,
      field: {
        field1: {
          width: 100,
          selected: true
        }
      },
      filter: {
        and: [
          {
            field1: {
              eq: 'value1'
            }
          }
        ]
      },
      fields: ['field1'],
      sorts: ['field1']
    }
    expect(cleanFieldFromView(fieldName, view)).toEqual(expectedView)
  })

  test('should remove field from view.fields', () => {
    const fieldName = 'field1'
    const expectedView = {
      ...view,
      field: {
        field2: {
          width: 150,
          selected: false
        }
      },
      fields: ['field2'],
      sorts: ['-field2']
    }
    expect(cleanFieldFromView(fieldName, view)).toEqual(expectedView)
  })

  test('should remove field from view.sorts', () => {
    const fieldName = 'field1'
    const expectedView = {
      ...view,
      field: {
        field2: {
          width: 150,
          selected: false
        }
      },
      fields: ['field2'],
      sorts: ['-field2']
    }
    expect(cleanFieldFromView(fieldName, view)).toEqual(expectedView)
  })
})
