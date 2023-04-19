import { atom, useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'

import type { Column } from '../column/Column'

const columnsAtom = atom<Column[]>([])

export const useColumns = () => {
  const [view] = useActivatedView()
  const [dataset] = useActivatedDataset()
  const { t } = useTranslation()
  const [_columns, updateColumns] = useAtom(columnsAtom)

  const columns = useMemo(
    () => {
      if (!dataset || !view) return []

      return Object.entries(view?.column ?? {})
        // sort by position
        .sort((a, b) => a[1].pos - b[1].pos)
        .map<Column>(([columnName, viewColumn]) => {
          const datasetColumn = dataset?.column[columnName]

          if (!datasetColumn) throw new Error(`Column ${columnName} not found in dataset`)

          return {
            // column
            name: columnName,
            ...datasetColumn,
            ...viewColumn,
            // grid column
            id: columnName,
            title: datasetColumn.title || t(`column.${columnName}`) || t(`field.${datasetColumn.field}`),
            icon: datasetColumn.field,
            hasMenu: true,
            width: viewColumn?.width
          }
        })
    },
    [dataset, view]
  )
  const visibleColumns = useMemo(() => columns.filter((column) => column.selected), [columns])

  useEffect(() => {
    updateColumns(columns ?? [])
  }, [_columns])

  return {
    columns,
    updateColumns,
    visibleColumns
  }
}
