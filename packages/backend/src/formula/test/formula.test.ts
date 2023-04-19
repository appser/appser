import formula from '..'

describe('class Formula', () => {
  test('should pass expression', () => {
    expect(formula.isValidExpression('=1')).toBe(true)
    expect(formula.isValidExpression('=TODAY()')).toBe(true)
  })

  describe('parse', () => {
    test('should work', () => {
      expect(formula.parse('SUM(1,2)')).toEqual('SUM(1,2)')
      expect(formula.parse('=SUM(1,2)')).toEqual(3)
      expect(formula.parse([1, '=SUM(1,2)'])).toEqual([1, 3])
      expect(formula.parse({ a: 1, b: 'foo' })).toEqual({ a: 1, b: 'foo' })
      expect(formula.parse({ a: 1, b: '=SUM(1,2)' })).toEqual({ a: 1, b: 3 })
      expect(formula.parse({ a: 1, b: ['=SUM(1,2)', 'bar'] })).toEqual({ a: 1, b: [3, 'bar'] })
      expect(formula.parse({ a: 1, b: { c: ['=SUM(1,2)'] } })).toEqual({ a: 1, b: { c: [3] } })
    })

    test('should fail', () => {
      expect(() => formula.parse('=NOT_EXIST_FUNCTION()')).toThrowError()
    })
  })
})
