import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getDatasetQuery } from 'web/servers/dataset/queries'
import db from 'web/vendor/db'

export type RestColumnParams = Parameters<typeof db.dataset.resetColumn>[0]

export const useResetColumn = (datasetId: string, columnName: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: {
      title: RestColumnParams['requestBody']['title']
      field: RestColumnParams['requestBody']['field']
      options: RestColumnParams['requestBody']['options']
    }) => db.dataset.resetColumn({
      datasetId,
      columnName,
      requestBody: {
        title: values.title,
        field: values.field,
        options: values.options
      }
    }),
    onSuccess(_, value) {
      queryClient.invalidateQueries({
        ...getDatasetQuery(datasetId)
      })
    }
  })
}
