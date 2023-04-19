import { DataEditor } from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
import { Flex } from '@mantine/core'
import { useCallback, useMemo, useRef, useState } from 'react'
import { openCreateRecord } from 'web/components/modals/createRecord'
import useAccess from 'web/hooks/useAccess'

import { CellEditFloatingIcon } from './cell/CellEditFloatingIcon'
import { CellEditPopover } from './cell/CellEditPopover'
import { ColumnAddButton } from './column/ColumnAddButton'
import { ColumnMenu } from './column/ColumnMenu'
import { GridToolbar } from './GridToolbar'
import { useActivatedCell } from './hooks/useActivatedCell'
import { useDataSource } from './hooks/useDataSource'
import { useEditCell } from './hooks/useEditCell'
import { useGridSelection } from './hooks/useGridSelection'
import { useGridTheme } from './hooks/useGridTheme'
import { useHeaderIcons } from './hooks/useHeaderIcons'
import { useHoverItem } from './hooks/useHoverItem'
import { userResizeColumn } from './hooks/userResizeColumn'
import { RowMenu } from './row/RowMenu'
import { StatusBar } from './StatusBar'

import type { Column } from './column/Column'
import type { DataEditorRef, Rectangle } from '@glideapps/glide-data-grid'
import type { FC } from 'react'
import type { Row } from 'web/components/views/GridView/row/Row'
import type { TView } from 'web/servers/dataset/types'

interface ShowMenu {
  bounds: Rectangle
  type: 'column' | 'row'
  column?: Column
  row?: Row
}

export interface GridViewProps {
  view: TView
}

const GridView: FC<GridViewProps> = ({ view }) => {
  const { can } = useAccess()
  const { datasetId, appId } = view
  const { allow: allowCreateColumn } = can('app:dataset:column:add', { datasetId, appId })
  const gridRef = useRef<DataEditorRef | null>(null)
  const [showMenu, setShowMenu] = useState<ShowMenu>()
  const [activatedCell] = useActivatedCell()
  const gridTheme = useGridTheme()
  const { props: dataSourceProps, getRow, getCell, getColumn, columns, isScrolling } = useDataSource()
  const { props: headerIconsProps } = useHeaderIcons()
  const { handler: itemHoveredHandler, cell: hoveredCell } = useHoverItem({ isScrolling })
  const { handler: gridSelectionHandler } = useGridSelection()
  const { handler: editCellHandler } = useEditCell()
  const { handler: resizeColumnHandler } = userResizeColumn()

  const showColumnMenu = useCallback((col: number, bounds: Rectangle) => {
    setShowMenu(pre => pre
      ? undefined
      : {
          type: 'column',
          column: columns[col],
          bounds
        })
  }, [columns])

  const editingCell = useMemo(() => {
    const { columnIndex, rowIndex, bounds } = hoveredCell

    if (columnIndex === undefined || rowIndex === undefined || bounds === undefined) return

    const column = getColumn(columnIndex)
    const cell = getCell([columnIndex, rowIndex])
    const row = getRow(rowIndex)

    if (!column || !cell || !row) return

    return {
      cell,
      column,
      row,
      bounds,
      location: [columnIndex, rowIndex] as const
    }
  }, [hoveredCell])

  return (
    <Flex direction="column" h="100%" sx={{ flex: 1 }}>
      <GridToolbar
        onClickCreate={() => openCreateRecord({
          viewId: view.id,
          datasetId,
          columns
        })}
      />
      <DataEditor
        // grid
        theme={gridTheme}
        rowMarkers='clickable-number'
        ref={gridRef}
        width="100%"
        height='100%'
        // columnSelect='none'
        rangeSelect='multi-rect'
        rowSelect='multi'
        drawFocusRing={false}
        smoothScrollX
        smoothScrollY
        {...itemHoveredHandler}
        {...gridSelectionHandler}
        {...dataSourceProps}
        // header
        {...headerIconsProps}
        onHeaderMenuClick={showColumnMenu}
        onHeaderContextMenu={(col, { bounds, preventDefault }) => {
          preventDefault()
          showColumnMenu(col, bounds)
        }}
        // column
        freezeColumns={view.stickyColumn}
        {...resizeColumnHandler}
        // cell
        {...editCellHandler}
        onCellContextMenu={([col, _row], { bounds, preventDefault, localEventX, localEventY }) => {
          preventDefault()
          const row = getRow(_row)

          if (!row) return

          setShowMenu({
            bounds: {
              x: bounds.x + localEventX,
              y: bounds.y + localEventY,
              width: 0,
              height: 0
            },
            type: 'row',
            row
          })
        }}
        rowHeight={35}
        headerHeight={37}
        // right element
        rightElement={allowCreateColumn && <ColumnAddButton />}
        rightElementProps={{ fill: true }}
      />

      <StatusBar />

      {showMenu && showMenu.column && (
        <ColumnMenu
          opened={showMenu.type === 'column'}
          onClose={() => setShowMenu(undefined)}
          datasetId={datasetId}
          column={showMenu.column}
          bounds={showMenu.bounds}
        />
      )}

      {showMenu && showMenu.row && (
        <RowMenu
          opened={showMenu.type === 'row'}
          onClose={() => setShowMenu(undefined)}
          datasetId={datasetId}
          row={showMenu.row}
          bounds={showMenu.bounds}
        />
      )}

      {editingCell && !isScrolling && <CellEditFloatingIcon {...editingCell} />}
      {activatedCell && <CellEditPopover />}

    </Flex>
  )
}

export default GridView
