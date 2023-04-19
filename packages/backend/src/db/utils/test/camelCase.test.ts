import { camelCase } from '../camelCase'

test('camelCase', () => {
  expect(camelCase('hello_world')).toEqual('helloWorld')
  expect(camelCase('hello-world')).toEqual('hello-world')
  expect(camelCase('hello.world')).toEqual('hello.world')
})
