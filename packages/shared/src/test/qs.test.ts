import qs from '../qs'

test('stringify', () => {
  expect(qs.stringify({ a: { eq: 1, gt: 2 } })).toEqual('a.eq=1&a.gt=2')
  expect(qs.stringify({ a: { eq: [1, 2] } })).toEqual('a.eq=1,2')
  expect(qs.stringify({ a: { 'eq:or': [1, 2] } })).toEqual('a.eq:or=1,2')
})

test('parser', () => {
  expect(qs.parse('a.eq=1&a.gt=2')).toEqual({ a: { eq: '1', gt: '2' } })
  expect(qs.parse('a.eq=1,2')).toEqual({ a: { eq: ['1', '2'] } })
  expect(qs.parse('a.eq:or=1,2')).toEqual({ a: { 'eq:or': ['1', '2'] } })
})
