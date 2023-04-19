import db from 'web/vendor/db'

export const listAccountOrgQuery = {
  queryKey: ['account', 'orgs'],
  queryFn: async () => db.account.listAccountOrg()
}

export const getAccountQuery = {
  queryKey: ['account'],
  queryFn: async () => db.account.getAccount()
}

export const listAccountPolicyQuery = {
  queryKey: ['account', 'polices'],
  queryFn: async () => db.account.listAccountPolicy()
}
