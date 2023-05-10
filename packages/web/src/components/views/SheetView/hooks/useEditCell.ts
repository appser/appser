import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useUpdateRecord } from 'web/hooks/dataset/useUpdateRecord'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'

import { useDataSource } from './useDataSource'

import type { DataEditorProps } from '@glideapps/glide-data-grid'

export function useEditCell() {
  const p = useParams()
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()
  const { getRow, getField } = useDataSource()
  const datasetId = dataset?.id ?? p.datasetId ?? ''
  const viewId = view?.id ?? p.viewId ?? ''
  const { mutate } = useUpdateRecord(datasetId, viewId)

  /** only run when cell is checkbox cell */
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
