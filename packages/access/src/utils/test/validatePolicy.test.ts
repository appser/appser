import { validatePolicy } from '../validatePolicy'

test('should return true if the resource and action are a match', () => {
  expect(validatePolicy({
    action: 'org:get',
    resource: { orgId: '123' }
  })).toBe(true)

  expect(validatePolicy({
    action: ['org:get'],
    resource: { orgId: '123' }
  })).toBe(true)
})

test('should return false when the action is not defined', () => {
  expect(() => validatePolicy({
    action: 'org:unknown',
    resource: { orgId: '123' }
  })).toThrowError()

  expect(() => validatePolicy({
    action: ['org:unknown', 'org:getUnknown'],
    resource: { orgId: '123' }
  })).toThrowError()
})

test('should throw error when the actions\'s resources are inconsistent', () => {
  expect(() => validatePolicy({
    action: ['org:get', 'dataset:get'],
    resource: { appId: '123', foo: '123' }
  })).toThrowError()

  expect(() => validatePolicy({
    action: ['org:none', 'dataset:none'],
    resource: { orgId: '123' }
  })).toThrowError()

  expect(() => validatePolicy({
    action: 'org:get',
    resource: { appId: '123' }
  })).toThrowError()
})
