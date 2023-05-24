import { useMutation, useQueryClient } from '@tanstack/react-query'
import cloneDeep from 'lodash/cloneDeep'
import { useActivateOrg } from 'web/hooks/ui/useActivateOrg'
import db from 'web/vendor/db'

import { listOrgAppQuery } from '../org/useListOrgApp'

import type { ListOrgAppResponse } from '../org/useListOrgApp'

type UpdateAppParams = Parameters<typeof db.app.updateApp>[0]

export const useUpdateApp = () => {
  const [org] = useActivateOrg()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (p: UpdateAppParams) => {
      return db.app.updateApp(p)
    },
    onSuccess: (_, p) => {
      org.id && queryClient.setQueriesData<ListOrgAppResponse>(listOrgAppQuery(org.id), (oldData) => {
        if (!oldData) return

        return cloneDeep(oldData).map((app) => {
          if (app.id === p.appId) {
            return {
              ...app,
              ...p
            }
          }

          return app
        })
      })
    }
  })
}
