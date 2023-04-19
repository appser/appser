import { filter, isMatchObject, isMatchString } from '../match'

test('filter', () => {
  expect(filter(['foo', 'bar', 'baz', 'qux'], ['f*', 'b*'])).toEqual(['foo', 'bar', 'baz'])
  expect(filter('foo', ['f*', 'b*'])).toEqual(['foo'])
})

test('match string', () => {
  expect(isMatchString('foo', ['b*', 'f*'])).toBe(true)
  expect(isMatchString('*', ['*'])).toBe(true)
  expect(isMatchString('foo', '{b*,f*}')).toBe(true)
  expect(isMatchString('foo', 'f*')).toBe(true)
  expect(isMatchString('foo', 'b*')).toBe(false)
  expect(isMatchString('foo', '*')).toBe(true)
  expect(isMatchString('foo/a/b/c', 'foo/*')).toBe(false)
  expect(isMatchString('foo/a/b/c', 'foo/**')).toBe(true)
})

test('match object', () => {
  expect(isMatchObject({ foo: 'bar', baz: 'qux' }, { foo: 'b*', baz: 'q*' })).toBe(true)
  expect(isMatchObject({ foo: 'bar', baz: 'qux' }, { foo: 'b*', baz: 'q*', other: 'abc' })).toBe(true)
  expect(isMatchObject({ foo: 'bar' }, { foo: ['b*', 'f*'] })).toBe(true)
  expect(isMatchObject({ foo: 'bar', baz: 'qux' }, {})).toBe(false)
  expect(isMatchObject({ foo: 'bar', baz: 'qux' }, { foo: 'a' })).toBe(false)
})
