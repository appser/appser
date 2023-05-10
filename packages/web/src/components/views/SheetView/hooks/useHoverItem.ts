import { useCallback, useEffect, useState } from 'react'

import type { GridMouseEventArgs, Rectangle } from '@glideapps/glide-data-grid'
import type { GetRowThemeCallback } from '@glideapps/glide-data-grid/dist/ts/data-grid/data-grid-render'

interface Props {
  isScrolling: boolean
}

export function useHoverItem({ isScrolling }: Props) {
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
    isScrolling && clear()
  }, [isScrolling])

  return {
    cell: {
      bounds: cellBounds,
      fieldIndex,
      rowIndex
    },
    handler: {
      onItemHovered,
      getRowThemeOverride
    }
  }
}
