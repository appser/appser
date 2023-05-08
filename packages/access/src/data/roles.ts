/**
 * System role id must be less than 10000
 * org role id range is >= 2000 and < 3000,
 * app role id range is >= 3000 and < 4000,
 */
export const BUILD_IN_ROLE_MAX_ID = 10000
export const ORG_BUILD_IN_ROLE_ID_RANGE = [2000, 3000]
export const APP_BUILD_IN_ROLE_ID_RANGE = [3000, 4000]

export const fullAppResource = {
  appId: '*', datasetId: '*', viewId: '*', recordId: '*', fieldName: '*'
} as const

export const roles = Object.freeze({
  system: {
    // TODO
    admin: {
      id: '1000',
      name: 'system.admin',
      policies: []
    },
    user: {
      id: '1001',
      name: 'system.user',
      policies: [
        {
          action: ['account:*'],
          resource: { userId: '{{userId}}' }
        }
      ]
    }
  },
  /** org role ID range is [2000, 2999] */
  org: {
    owner: {
      id: '2000',
      name: 'org.owner',
      policies: [
        {
          action: ['org:*', 'app:*'],
          resource: { ...fullAppResource, orgId: '{{orgId}}', appId: '{{appIds}}' }
        }
      ]
    },
    member: {
      id: '2001',
      name: 'org.member',
      policies: [
        {
          action: ['org:get', 'org:people:list', 'org:app:list', 'org:app:create'],
          resource: { orgId: '{{orgId}}' }
        }
      ]
    },
    outsideCollaborator: {
      id: '2002',
      name: 'org.outsideCollaborator',
      policies: []
    }
  },
  /** app role ID range is [3000, 3999] */
  app: {
    admin: {
      id: '3000',
      name: 'app.admin',
      policies: [
        {
          action: ['app:*'],
          resource: { ...fullAppResource, appId: '{{appId}}' }
        }
      ]
    },
    editor: {
      id: '3001',
      name: 'app.editor',
      policies: [
        {
          action: ['app:get', 'app:dataset:get', 'app:dataset:view:*', 'app:dataset:record:*'],
          resource: { ...fullAppResource, appId: '{{appId}}' }
        }
      ]
    },
    readOnly: {
      id: '3002',
      name: 'app.readOnly',
      policies: [
        {
          action: ['app:get', 'app:*:get', 'app:dataset:*:list'],
          resource: { ...fullAppResource, appId: '{{appId}}' }
        }
      ]
    }
  }
})
