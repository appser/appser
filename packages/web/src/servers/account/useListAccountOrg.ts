import { useQuery } from '@tanstack/react-query'

import { listAccountOrgQuery } from './queries'

import type db from 'web/vendor/db'

export type ListAccountOrgResponse = Awaited<ReturnType<typeof db.account.listAccountOrg>>

export const useListAccountOrg = () => useQuery(listAccountOrgQuery)
