import { Flex } from '@appser/ui'
import { DataEditor } from '@glideapps/glide-data-grid'
import { useCallback, useMemo, useRef, useState } from 'react'
import { openCreateRecord } from 'web/components/modals/createRecord'
import useAccess from 'web/hooks/useAccess'

import { CellEditFloatingIcon } from './cell/CellEditFloatingIcon'
import { CellEditPopover } from './cell/CellEditPopover'
import { FieldAddButton } from './field/FieldAddButton'
import { FieldMenu } from './field/FieldMenu'
import { useActivatedCell } from './hooks/useActivatedCell'
import { useDataSource } from './hooks/useDataSource'
import { useEditCell } from './hooks/useEditCell'
import { useGridSelection } from './hooks/useGridSelection'
import { useGridTheme } from './hooks/useGridTheme'
import { useHeaderIcons } from './hooks/useHeaderIcons'
import { useHoverItem } from './hooks/useHoverItem'
import { userResizeColumn } from './hooks/userResizeColumn'
import { RowMenu } from './row/RowMenu'
import { StatusBar } from './statusBar/StatusBar'
import { SheetToolbar } from './toolbar/Toolbar'

import type { SheetField } from './field/Field'
import type { DataEditorRef, Rectangle } from '@glideapps/glide-data-grid'
import type { FC } from 'react'
import type { Row } from 'web/components/views/SheetView/row/Row'
import type { View } from 'web/types'

import '@glideapps/glide-data-grid/dist/index.css'

interface ShowMenu {
  bounds: Rectangle
  type: 'field' | 'row'
  field?: SheetField
  row?: Row
}

export interface GridViewProps {
  view: View
}

const GridView: FC<GridViewProps> = ({ view }) => {
  const { can } = useAccess()
  const { datasetId, appId } = view
  const { allow: allowCreateField } = can('app:dataset:field:add', { datasetId, appId })
  const gridRef = useRef<DataEditorRef | null>(null)
  const [showMenu, setShowMenu] = useState<ShowMenu>()
  const [activatedCell] = useActivatedCell()
  const gridTheme = useGridTheme()
  const { props: dataSourceProps, getRow, getCell, getField, fields, isScrolling } = useDataSource()
  const { props: headerIconsProps } = useHeaderIcons()
  const { handler: itemHoveredHandler, cell: hoveredCell } = useHoverItem({ isScrolling })
  const { handler: gridSelectionHandler } = useGridSelection()
  const { handler: editCellHandler } = useEditCell()
  const { handler: resizeColumnHandler } = userResizeColumn()

  const showFieldMenu = useCallback((col: number, bounds: Rectangle) => {
    setShowMenu(pre => pre
      ? undefined
      : {
          type: 'field',
          field: fields[col],
          bounds
        })
  }, [fields])

  const editingCell = useMemo(() => {
    const { fieldIndex, rowIndex, bounds } = hoveredCell

    if (fieldIndex === undefined || rowIndex === undefined || bounds === undefined) return

    const field = getField(fieldIndex)
    const cell = getCell([fieldIndex, rowIndex])
    const row = getRow(rowIndex)

    if (!field || !cell || !row) return

    return {
      cell,
      field,
      row,
      bounds,
      location: [fieldIndex, rowIndex] as const
    }
  }, [hoveredCell])

  return (
    <Flex direction="column" h="100%" sx={{ flex: 1 }}>
      <SheetToolbar
        onHandleCreate={() => openCreateRecord({
          viewId: view.id,
          datasetId,
          fields
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
        onHeaderMenuClick={showFieldMenu}
        onHeaderContextMenu={(col, { bounds, preventDefault }) => {
          preventDefault()
          showFieldMenu(col, bounds)
        }}
        // column
        freezeColumns={view.stickyField}
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
        rightElement={allowCreateField && <FieldAddButton />}
        rightElementProps={{ fill: true }}
      />

      <StatusBar />

      {showMenu && showMenu.field && (
        <FieldMenu
          opened={showMenu.type === 'field'}
          onClose={() => setShowMenu(undefined)}
          datasetId={datasetId}
          field={showMenu.field}
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
