import { formatParamUrl } from '../openapi'

describe('formatParamUrl', () => {
  test('format param url', () => {
    expect(formatParamUrl('/')).toBe('/')
    expect(formatParamUrl('/abc')).toBe('/abc')
    expect(formatParamUrl('/abc/:id')).toBe('/abc/{id}')
  })
})
