import { CompactSelection, GridCellKind } from '@glideapps/glide-data-grid'
import { range } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { RECORDS_PAGE_SIZE, useQueryViewRecord } from 'web/hooks/dataset/useQueryViewRecord'
import { useActivateDataset } from 'web/hooks/ui/useActivateDataset'
import { useActivateView } from 'web/hooks/ui/useActivateView'

import { useFields } from './useFields'
import { useScrollDirection } from './useScrollDirection'
import { useFieldsConfig } from '../fields'

import type { Field } from '../field/Field'
import type { DataEditorProps, GridCell, Rectangle } from '@glideapps/glide-data-grid'
import type { Row } from 'web/components/views/SheetView/row/Row'
import type { Record } from 'web/types'

export function useViewDataSource() {
  const [dataset] = useActivateDataset()
  const [view] = useActivateView()
  const [rows, setRows] = useState(0)
  const [visiblePages, setVisiblePages] = useState<Rectangle>({ x: 0, y: 0, width: 0, height: 0 })
  const { data, hasNextPage, fetchNextPage } = useQueryViewRecord()
  const { selectedFields } = useFields()
  const { hasScrolledTo } = useScrollDirection()
  const loadingRef = useRef(CompactSelection.empty())
  const visiblePagesRef = useRef(visiblePages)
  const fieldsConfig = useFieldsConfig()

  visiblePagesRef.current = visiblePages

  const getRow = useCallback((rowIndex: number): Row | undefined => {
    const pageIndex = Math.floor(rowIndex / RECORDS_PAGE_SIZE)
    const recordIndex = rowIndex % RECORDS_PAGE_SIZE
    const record = data?.pages[pageIndex]?.records?.[recordIndex] as Record

    if (!record) return

    return {
      rowIndex,
      pageIndex,
      recordIndex,
      record
    }
  }, [data])

  const getField = useCallback((fieldIndex: number): Field | undefined => {
    return selectedFields?.[fieldIndex]
  }, [selectedFields])

  const getCellContent = useCallback<DataEditorProps['getCellContent']>(([fieldIndex, rowIndex]) => {
    const row = getRow(rowIndex)
    const loadingCell: GridCell = {
      kind: GridCellKind.Loading,
      allowOverlay: false
    }
    const field = selectedFields?.[fieldIndex]

    if (!dataset || !field || !row) return loadingCell

    const data = row?.record?.[field.name] ?? ''
    const cell = fieldsConfig[field.type]?.toCellContent({ field, row, value: data }) ?? loadingCell

    return cell
  }, [dataset, view, data, selectedFields])

  const onVisibleRegionChanged: NonNullable<DataEditorProps['onVisibleRegionChanged']> = useCallback(r => {
    if ('tx' in r && 'ty' in r) {
      hasScrolledTo(Number(r.tx), Number(r.ty))
    }

    setVisiblePages(cv => {
      if (r.x === cv.x && r.y === cv.y && r.width === cv.width && r.height === cv.height) return cv

      return r
    })
  }, [])

  const loadPage = useCallback(async (pageIndex: number) => {
    loadingRef.current = loadingRef.current.add(pageIndex)

    const startIndex = pageIndex * RECORDS_PAGE_SIZE
    const vr = visiblePagesRef.current
    const damageList: { cell: [number, number] }[] = []
    const { data } = await fetchNextPage()

    data?.pages[pageIndex]?.records.forEach((row, i) => {
      for (let col = vr.x; col <= vr.x + vr.width; col++) {
        damageList.push({
          cell: [col, i + startIndex]
        })
      }
    })

    // gridRef?.current?.updateCells(damageList)
  }, [fetchNextPage])

  useEffect(() => {
    const totalRows = data?.pages.reduce((acc, page, i) => {
      loadingRef.current = loadingRef.current.add(i)

      return acc + page.records.length
    }, 0)

    setRows(totalRows ?? 0)
  }, [data])

  useEffect(() => {
    const r = visiblePages
    const firstPageIndex = Math.max(0, Math.floor((r.y - RECORDS_PAGE_SIZE / 2) / RECORDS_PAGE_SIZE))
    const lastPageIndex = Math.floor((r.y + r.height + RECORDS_PAGE_SIZE / 2) / RECORDS_PAGE_SIZE)

    const loadPages = async () => {
      for (const pageIndex of range(firstPageIndex, lastPageIndex + 1)) {
        if (loadingRef.current.hasIndex(pageIndex)) continue
        hasNextPage && await loadPage(pageIndex)
      }
    }

    loadPages()
  }, [loadPage, hasNextPage, visiblePages])

  return {
    getRow,
    getField,
    getGridCell: getCellContent,
    props: {
      rows,
      columns: selectedFields,
      // when the mouse is moving, the grid will always call getCellContent to get the cell content,
      // perhaps this is a bug?
      getCellContent,
      onVisibleRegionChanged
    }
  }
}
