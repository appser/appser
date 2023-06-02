import { Flex } from '@appser/ui'
import { DataEditor, GridCellKind, Item } from '@glideapps/glide-data-grid'
import { useCallback, useRef, useState } from 'react'
import { openCreateRecord } from 'web/components/modals/createRecord'
import useAccess from 'web/hooks/ui/useAccess'

import { CellEditor } from './cell/CellEditor'
import { CellEditorFloatingIcon } from './cell/CellEditorFloatingIcon'
import { FieldAddButton } from './field/FieldAddButton'
import { FieldMenu } from './field/FieldMenu'
import { useEditingCell } from './hooks/useEditingCell'
import { useGridCellEdit } from './hooks/useGridCellEdit'
import { useGridSelection } from './hooks/useGridSelection'
import { useGridTheme } from './hooks/useGridTheme'
import { useHeaderIcons } from './hooks/useHeaderIcons'
import { useHoverItem } from './hooks/useHoverItem'
import { userResizeColumn } from './hooks/userResizeColumn'
import { useViewDataSource } from './hooks/useViewDataSource'
import { RowMenu } from './row/RowMenu'
import { StatusBar } from './statusBar/StatusBar'
import { SheetToolbar } from './toolbar/Toolbar'

import type { Field } from './field/Field'
import type { DataEditorRef, Rectangle } from '@glideapps/glide-data-grid'
import type { FC } from 'react'
import type { Row } from 'web/components/views/SheetView/row/Row'
import type { View } from 'web/types'

import '@glideapps/glide-data-grid/dist/index.css'
import { useFields } from './hooks/useFields'
import { RowExpandFloatingIcon } from './cell/RowExpandFloatingIcon'
import { useTimeout } from '@appser/ui/hooks'

interface ShowMenu {
  bounds: Rectangle
  type: 'field' | 'row'
  field?: Field
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
  const gridTheme = useGridTheme()
  const [editingCell, setEditingCell] = useEditingCell()
  const { selectedFields: fields } = useFields()
  const { props: dataSourceProps, getRow } = useViewDataSource()
  const { props: headerIconsProps } = useHeaderIcons()
  const { handler: itemHoveredHandler, hoveringCell } = useHoverItem()
  const { handler: gridSelectionHandler } = useGridSelection()
  const { handler: editCellHandler } = useGridCellEdit()
  const { handler: resizeColumnHandler } = userResizeColumn()
  const activeCell = useRef<Item | null>(null)
  const { start, clear } = useTimeout(() => {
    activeCell.current = null
  } , 300)

  const showFieldMenu = useCallback((col: number, bounds: Rectangle) => {
    setShowMenu(pre => pre
      ? undefined
      : {
          type: 'field',
          field: fields[col],
          bounds
        })
  }, [fields])

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
        rowMarkerWidth={50}
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
        onCellClicked={(cell) => {
          if (cell[0] === activeCell.current?.[0] && cell[1] === activeCell.current?.[1]) {
            setEditingCell(hoveringCell)
          } else {
            if (activeCell.current) {
              activeCell.current = null
              clear()
            }
            activeCell.current = cell
            start()
          }
        }}
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

      {/* {hoveringCell && <CellEditorFloatingIcon cell={hoveringCell} />} */}
      {hoveringCell && <RowExpandFloatingIcon cell={hoveringCell} />}
      {editingCell && <CellEditor cell={editingCell} />}

    </Flex>
  )
}

export default GridView
