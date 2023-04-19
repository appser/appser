import { useMutation, useQueryClient } from '@tanstack/react-query'
import db from 'web/vendor/db'

import { getAppQuery } from './queries'

export type AddAppPeopleParams = Parameters<typeof db.app.addAppPeople>[0]

export const useAddAppPeople = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (p: AddAppPeopleParams) => {
      return await db.app.addAppPeople(p)
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries(getAppQuery({ appId: variables.appId }))
    }
  })
}
