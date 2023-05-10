import { useMutation, useQueryClient } from '@tanstack/react-query'
import db from 'web/vendor/db'

import { getAccountQuery } from './useGetAccount'

type UpdateAccountProfileParams = Parameters<typeof db.account.updateAccountProfile>[0]

export const useUpdateAccountProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (p: UpdateAccountProfileParams) => {
      return db.account.updateAccountProfile(p)
    },
    onSuccess: (data, v) => {
      queryClient.invalidateQueries(getAccountQuery)
    }
  })
}
