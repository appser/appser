import Access from '..'
import { roles } from '../data/roles'

const parse = require('json-templates')

describe('class Access', () => {
  const ac = new Access([
    { action: 'org:*', resource: { orgId: 'foo' }, attributes: ['id'] },
    { action: 'org:get', resource: { orgId: 'foo' }, attributes: ['id', 'name'] }
  ]).grant({ action: 'app:dataset:get', resource: { appId: '1', datasetId: '2' } })

  test('.grant', () => {
    expect(() => new Access({ action: 'app:unknown', resource: {} })).toThrowError()
    expect(ac.policies.length).toBe(3)
  })

  test('should return correct when matching with action and resource', () => {
    expect(ac.can('org:get', { orgId: '123' }).allow).toBe(false)
    expect(ac.can('org:get', { orgId: '123' }).allow).toBe(false)
    expect(ac.can('app:dataset:get', { appId: '123', datasetId: '123' }).allow).toBe(false)
    expect(ac.can('org:get', { orgId: '123' }).allow).toBe(false)
  })

  test('.attributes', () => {
    expect(ac.can('org:get', { orgId: 'foo' }).attributes).toStrictEqual(['id', 'name'])
    expect(ac.can('org:update', { orgId: 'foo' }).attributes).toStrictEqual(['id'])
  })

  test('should return correct when match attributes', () => {
    expect(ac.can('org:get', { orgId: 'foo' }, []).allow).toBe(true)
    expect(ac.can('org:get', { orgId: 'foo' }, ['unknown']).allow).toBe(false)
  })
})

describe('default roles', () => {
  test('system user', () => {
    const ac = new Access(parse(roles.system.user.policies)({
      userId: '1'
    }))

    expect(ac.can('account:org:create', { userId: '1' }).allow).toBe(true)
    expect(ac.can('account:user:get', { userId: '1' }).allow).toBe(true)
    expect(ac.can('org:people:list', { orgId: '1' }).allow).toBe(false)
  })

  test('org owner', () => {
    const ac = new Access(parse(roles.org.owner.policies)({
      orgId: '1',
      appIds: ['2', '3']
    }))

    expect(ac.can('org:delete', { orgId: '1' }).allow).toBe(true)
    expect(ac.can('org:invitation:create', { orgId: '1' }).allow).toBe(true)
    expect(ac.can('app:get', { appId: '2' }).allow).toBe(true)
    expect(ac.can('app:dataset:column:add', { appId: '2', datasetId: '123' }).allow).toBe(true)

    // deny
    expect(ac.can('account:org:create', { userId: '123' }).allow).toBe(false)
  })

  test('org member', () => {
    const ac = new Access(parse(roles.org.member.policies)({
      orgId: '1'
    }))

    expect(ac.can('org:get', { orgId: '1' }).allow).toBe(true)
    expect(ac.can('org:app:list', { orgId: '1' }).allow).toBe(true)
    expect(ac.can('org:delete', { orgId: '1' }).allow).toBe(false)
    expect(ac.can('org:invitation:create', { orgId: '1' }).allow).toBe(false)

    // deny
    expect(ac.can('app:get', { appId: '1' }).allow).toBe(false)
    expect(ac.can('app:delete', { appId: '1' }).allow).toBe(false)
  })

  test('org outsideCollaborator', () => {
    const ac = new Access(parse(roles.org.outsideCollaborator.policies)({
      orgId: '1'
    }))

    expect(ac.can('org:get', { orgId: '1' }).allow).toBe(false)
  })

  test('app admin', () => {
    const ac = new Access(parse(roles.app.admin.policies)({
      appId: '1'
    }))
    expect(ac.can('app:get', { appId: '1' }).allow).toBe(true)
    expect(ac.can('app:delete', { appId: '1' }).allow).toBe(true)
    expect(ac.can('app:dataset:create', { appId: '1' }).allow).toBe(true)
    expect(ac.can('app:dataset:view:add', { appId: '1', datasetId: '123' }).allow).toBe(true)

    // deny
    expect(ac.can('org:get', { orgId: '1' }).allow).toBe(false)
    expect(ac.can('app:get', { appId: '2' }).allow).toBe(false)
  })

  test('app editor', () => {
    const ac = new Access(parse(roles.app.editor.policies)({
      appId: '1'
    }))

    expect(ac.can('app:get', { appId: '1' }).allow).toBe(true)
    expect(ac.can('app:dataset:create', { appId: '1' }).allow).toBe(true)
    expect(ac.can('app:dataset:view:add', { appId: '1', datasetId: '2' }).allow).toBe(true)

    // deny
    expect(ac.can('app:update', { appId: '1' }).allow).toBe(false)
  })

  test('app read only', () => {
    const ac = new Access(parse(roles.app.readOnly.policies)({
      appId: '1'
    }))

    expect(ac.can('app:get', { appId: '1' }).allow).toBe(true)
    expect(ac.can('app:dataset:get', { appId: '1', datasetId: '2' }).allow).toBe(true)
    expect(ac.can('app:dataset:view:list', { appId: '1', datasetId: '2' }).allow).toBe(true)
    expect(ac.can('app:dataset:column:get', { appId: '1', datasetId: '2', columnName: '3' }).allow).toBe(true)

    // deny
    expect(ac.can('app:update', { appId: '1' }).allow).toBe(false)
    expect(ac.can('app:dataset:create', { appId: '1' }).allow).toBe(false)
    expect(ac.can('app:dataset:view:add', { appId: '1', datasetId: '2' }).allow).toBe(false)
  })
})
