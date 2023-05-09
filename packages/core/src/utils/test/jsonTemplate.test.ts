import jsonTemplate from '../jsonTemplate'

describe('interpolate', () => {
  test('invalid interpolate', () => {
    expect(() => jsonTemplate('{{a}}', { b: 1 })).toThrowError()
    expect(() =>
      jsonTemplate(
        {
          a: '{{b}}'
        },
        {}
      )).toThrowError()
  })
})
