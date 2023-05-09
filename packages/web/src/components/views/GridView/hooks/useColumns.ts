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

      return view.columns.map<Column>(fieldName => {
        const columnInDataset = dataset.column[fieldName]
        const columnInView = view.column[fieldName]

        if (!columnInDataset || !columnInView) throw new Error(`Column ${fieldName} not found in dataset or view`)

        return {
          // column
          name: fieldName,
          ...columnInDataset,
          ...columnInView,
          // grid column
          id: fieldName,
          title: columnInDataset.title || t(`column.${fieldName}`) || t(`field.${columnInDataset.field}`),
          icon: columnInDataset.field,
          hasMenu: true,
          width: columnInView?.width
        }
      })
    },
    [dataset, view]
  )
  const visibleColumns = useMemo(() => columns.filter(column => column.selected), [columns])

  useEffect(() => {
    updateColumns(columns ?? [])
  }, [_columns])

  return {
    columns,
    updateColumns,
    visibleColumns
  }
}
