import { CompactSelection, GridCellKind } from '@glideapps/glide-data-grid'
import { range } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'
import { RECORDS_PAGE_SIZE, useQueryRecord } from 'web/servers/dataset/useQueryRecord'

import { useColumns } from './useColumns'
import { useScrollDirection } from './useScrollDirection'
import { useFields } from '../fields'

import type { Column } from '../column/Column'
import type { DataEditorProps, GridCell, Rectangle } from '@glideapps/glide-data-grid'
import type { Row } from 'web/components/views/GridView/row/Row'
import type { TRecord } from 'web/servers/dataset/types'

export function useDataSource() {
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()
  const [rows, setRows] = useState(0)
  const [visiblePages, setVisiblePages] = useState<Rectangle>({ x: 0, y: 0, width: 0, height: 0 })
  const { data, hasNextPage, fetchNextPage } = useQueryRecord()
  const { visibleColumns } = useColumns()
  const { isScrolling, hasScrolledTo } = useScrollDirection()
  const loadingRef = useRef(CompactSelection.empty())
  const visiblePagesRef = useRef(visiblePages)
  const fields = useFields()

  visiblePagesRef.current = visiblePages

  const getRow = useCallback((rowIndex: number): Row | undefined => {
    const pageIndex = Math.floor(rowIndex / RECORDS_PAGE_SIZE)
    const recordIndex = rowIndex % RECORDS_PAGE_SIZE
    const record = data?.pages[pageIndex]?.records?.[recordIndex] as TRecord

    if (!record) return

    return {
      rowIndex,
      pageIndex,
      recordIndex,
      record
    }
  }, [data])

  const getColumn = useCallback((columnIndex: number): Column | undefined => {
    return visibleColumns?.[columnIndex]
  }, [visibleColumns])

  const getCellContent = useCallback<DataEditorProps['getCellContent']>(([columnIndex, rowIndex]) => {
    const row = getRow(rowIndex)
    const loadingCell: GridCell = {
      kind: GridCellKind.Loading,
      allowOverlay: false
    }
    const column = visibleColumns?.[columnIndex]

    if (!dataset || !column || !row) return loadingCell

    const data = row?.record?.[column.name] ?? ''
    const cell = fields[column.field]?.toCellContent({ column, row, value: data }) ?? loadingCell

    return cell
  }, [dataset, view, data, visibleColumns])

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
    getColumn,
    getCell: getCellContent,
    columns: visibleColumns,
    isScrolling,
    props: {
      rows,
      columns: visibleColumns,
      // when the mouse is moving, the grid will always call getCellContent to get the cell content,
      // perhaps this is a bug?
      getCellContent,
      onVisibleRegionChanged
    }
  }
}

export type DataSource = ReturnType<typeof useDataSource>
