import type db from './vendor/db'
import type { QueryOptions } from '@tanstack/react-query'

export type ListRecord = Awaited<ReturnType<typeof db.dataset.listRecord>>

export type Query = Pick<QueryOptions, 'queryFn' | 'queryKey'>
