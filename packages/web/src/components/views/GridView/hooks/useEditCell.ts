import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'
import { useUpdateRecord } from 'web/servers/dataset/useUpdateRecord'

import { useDataSource } from './useDataSource'

import type { DataEditorProps } from '@glideapps/glide-data-grid'

export function useEditCell() {
  const p = useParams()
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()
  const { getRow, getColumn } = useDataSource()
  const datasetId = dataset?.id ?? p.datasetId ?? ''
  const viewId = view?.id ?? p.viewId ?? ''
  const { mutate } = useUpdateRecord(datasetId, viewId)

  /** only run when cell is checkbox cell */
  const onCellEdited: NonNullable<DataEditorProps['onCellEdited']> = useCallback(([columnIndex, rowIndex], cell) => {
    const row = getRow(rowIndex)
    const column = getColumn(columnIndex)
    const fieldName = column?.name

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
