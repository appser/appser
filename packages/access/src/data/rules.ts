export const rules = {
  // account permission
  'account:org:create': ['userId'],
  'account:org:list': ['userId'],
  'account:user:get': ['userId'],
  // org permission
  'org:update': ['orgId'],
  'org:get': ['orgId'],
  'org:delete': ['orgId'],
  'org:app:create': ['orgId'],
  'org:app:list': ['orgId'],
  'org:role:list': ['orgId'],
  'org:people:list': ['orgId'],
  'org:people:edit': ['orgId'],
  'org:people:remove': ['orgId'],
  'org:invitation:create': ['orgId'],
  // app permission
  'app:get': ['appId'],
  'app:update': ['appId'],
  'app:delete': ['appId'],
  'app:role:list': ['appId'],
  'app:people:list': ['appId'],
  'app:people:add': ['appId'],
  'app:people:edit': ['appId'],
  'app:people:remove': ['appId'],
  'app:dataset:create': ['appId'],
  'app:dataset:get': ['appId', 'datasetId'],
  'app:dataset:update': ['appId', 'datasetId'],
  'app:dataset:delete': ['appId', 'datasetId'],
  'app:dataset:view:list': ['appId', 'datasetId'],
  'app:dataset:view:add': ['appId', 'datasetId'],
  'app:dataset:field:add': ['appId', 'datasetId'],
  'app:dataset:field:get': ['appId', 'datasetId', 'fieldName'],
  'app:dataset:field:update': ['appId', 'datasetId', 'fieldName'],
  'app:dataset:field:delete': ['appId', 'datasetId', 'fieldName'],
  'app:dataset:view:get': ['appId', 'datasetId', 'viewId'],
  'app:dataset:view:update': ['appId', 'datasetId', 'viewId'],
  'app:dataset:view:delete': ['appId', 'datasetId', 'viewId'],
  'app:dataset:view:record:add': ['appId', 'datasetId', 'viewId'],
  'app:dataset:view:record:query': ['appId', 'datasetId', 'viewId'],
  'app:dataset:record:delete': ['appId', 'datasetId', 'recordId'],
  'app:dataset:view:record:get': ['appId', 'datasetId', 'viewId', 'recordId'],
  'app:dataset:view:record:field:update': ['appId', 'datasetId', 'viewId', 'recordId', 'fieldName']
} as const
