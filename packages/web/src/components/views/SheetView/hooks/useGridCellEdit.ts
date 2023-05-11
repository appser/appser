import { useCallback } from 'react'
import { useUpdateRecord } from 'web/hooks/dataset/useUpdateRecord'

import { useDataSource } from './useDataSource'

import type { DataEditorProps } from '@glideapps/glide-data-grid'

/**
 * only run when cell is checkbox cell
 * */
export function useGridCellEdit() {
  const { getRow, getField } = useDataSource()
  const { mutate } = useUpdateRecord()

  const onCellEdited: NonNullable<DataEditorProps['onCellEdited']> = useCallback(([fieldIndex, rowIndex], cell) => {
    const row = getRow(rowIndex)
    const field = getField(fieldIndex)
    const fieldName = field?.name

    if (!row || !fieldName) return

    const data = cell.data

    row.record = {
      id: row.record.id,
      [fieldName]: data
    }

    mutate(row)
  }, [getRow])

  return {
    handler: {
      onCellEdited
    }
  }
}
