import flattenObject from '../flattenObject'

describe('flattenObject', () => {
  test('flattens a nested object with dot notation', () => {
    const date = new Date()
    const nestedObj = {
      a: {
        b: 1,
        c: { d: [2] }
      },
      e: 3,
      f: new Array(10).fill(1, 3, 4),
      g: {
        h: date
      }
    }
    const flattenedObj = flattenObject(nestedObj)

    expect(flattenedObj).toEqual({
      'a.b': 1,
      'a.c.d.0': 2,
      e: 3,
      'f.3': 1,
      'g.h': date
    })
  })

  test('handles empty objects and null values', () => {
    const emptyObj = {}
    const nullObj = { a: null }
    const flattenedEmptyObj = flattenObject(emptyObj)
    const flattenedNullObj = flattenObject(nullObj)

    expect(flattenedEmptyObj).toEqual({})
    expect(flattenedNullObj).toEqual({ a: null })
  })
})
