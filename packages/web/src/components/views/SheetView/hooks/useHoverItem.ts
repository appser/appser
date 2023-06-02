import { atom, useAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'

import { useViewDataSource } from './useViewDataSource'

import type { Cell } from '../cell/Cell'
import type { GridMouseEventArgs, Rectangle } from '@glideapps/glide-data-grid'
import type { GetRowThemeCallback } from '@glideapps/glide-data-grid/dist/ts/data-grid/data-grid-render'

const hoveringCellAtom = atom<Cell | null>(null)
const useHoveringCell = () => useAtom(hoveringCellAtom)

export function useHoverItem() {
  const { getRow, getGridCell, getField } = useViewDataSource()
  const [hoveringCell, setHoveringCell] = useHoveringCell()
  const [cellBounds, setCellBounds] = useState<Rectangle>()
  const [rowIndex, setRowIndex] = useState<number>()
  const [fieldIndex, setFieldIndex] = useState<number>()

  const clear = () => {
    setRowIndex(undefined)
    setFieldIndex(undefined)
    setCellBounds(undefined)
  }

  const onItemHovered = useCallback((args: GridMouseEventArgs) => {
    const [col, row] = args.location
    if (args.kind === 'cell') {
      setRowIndex(row)
      setFieldIndex(col)
      setCellBounds(args.bounds)
    } else {
      clear()
    }
  }, [])

  const getRowThemeOverride = useCallback<GetRowThemeCallback>(
    row => {
      if (row !== rowIndex) return undefined

      return {
        bgCell: '#f7f7f7',
        bgCellMedium: '#f0f0f0'
      }
    },
    [rowIndex]
  )

  useEffect(() => {
    if (cellBounds && rowIndex !== undefined && rowIndex >= 0 && fieldIndex !== undefined && fieldIndex >= -1) {
      
      const field = getField(fieldIndex)
      const gridCell = getGridCell([fieldIndex, rowIndex])
      const row = getRow(rowIndex)
      if (gridCell && row) {
        setHoveringCell({
          gridCell,
          field: field ?? null,
          row,
          bounds: cellBounds,
          location: [fieldIndex, rowIndex] as const
        })
      } else {
        setHoveringCell(null)
      }
    } else {
      setHoveringCell(null)
    }
  }, [cellBounds, rowIndex, fieldIndex])

  return {
    hoveringCell,
    handler: {
      onItemHovered,
      getRowThemeOverride
    }
  }
}
