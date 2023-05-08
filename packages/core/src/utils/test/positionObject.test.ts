import { PositionObject } from '../positionObject'

test('rebuild', () => {
  const obj = {
    a: { pos: 0 },
    b: { pos: 1.5 },
    c: { pos: 3.23 }
  }
  const positionObject = new PositionObject(obj)

  expect(positionObject.rebuild()).toEqual({
    a: { pos: 0 },
    b: { pos: 100 },
    c: { pos: 200 }
  })
})

test('rebuild obj with some values missing `pos` property', () => {
  const obj = {
    a: { pos: 0.4 },
    b: { pos: 1.5 },
    c: {},
    d: {}
  }
  const positionObject = new PositionObject(obj)

  expect(positionObject.rebuild()).toEqual({
    a: { pos: 200 },
    b: { pos: 300 },
    c: { pos: 0 },
    d: { pos: 100 }
  })
})

test('add', () => {
  const obj = {
    a: { pos: 0.4 }
  }
  const positionObject = new PositionObject(obj)
  expect(positionObject.add('b', { some: 'bar' })).toEqual({
    a: { pos: 0.4 },
    b: { pos: 100.4, some: 'bar' }
  })
})
