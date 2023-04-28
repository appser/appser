import { Menu } from '@appser/ui'
import { useState } from 'react'
import { openAlertDialog } from 'web/components/modals/alertDialog'
import { useDeleteColumn } from 'web/servers/dataset/useDeleteColumn'
import { useResetColumn } from 'web/servers/dataset/useResetColumn'
import { useUpdateColumn } from 'web/servers/dataset/useUpdateColumn'

import { ColumnConfigForm } from './ColumnConfigForm'

import type { DatasetColumn } from './Column'
import type { Rectangle } from '@glideapps/glide-data-grid'
import type { MenuProps } from '@appser/ui'
import type { FC } from 'react'

interface ColumnMenuProps extends MenuProps {
  datasetId: string
  column: DatasetColumn
  bounds: Rectangle
}

export const ColumnMenu: FC<ColumnMenuProps> = ({ datasetId, bounds, column, onClose, ...rest }) => {
  const [showEditor, setShowEditor] = useState(false)
  const updateColumn = useUpdateColumn()
  const resetColumn = useResetColumn(datasetId, column.name)
  const deleteColumn = useDeleteColumn(datasetId, column.name)

  const deleteColumnConfirm = () => openAlertDialog({
    title: 'Are you sure you want to delete this column?',
    buttons: [
      {
        label: 'ok',
        onClick: () => deleteColumn.mutate()
      }
    ]
  })

  const onUpdate = (newColumn: DatasetColumn) => {
    newColumn.field !== column.field
      ? resetColumn.mutate(
        {
          title: newColumn.title,
          field: newColumn.field,
          options: 'options' in newColumn ? newColumn.options : undefined
        },
        {
          onSuccess() {
            onClose?.()
          }
        }
      )
      : updateColumn.mutate(
        {
          datasetId,
          columnName: column.name,
          requestBody: {
            title: newColumn.title,
            options: 'options' in newColumn ? newColumn.options : undefined
          }
        },
        {
          onSuccess() {
            onClose?.()
          }
        }
      )
  }

  return (
    <Menu position='bottom-start' offset={3} onClose={onClose} {...rest}>
      <Menu.Target>
        <div
          style={{
            left: bounds.x,
            top: bounds.y,
            width: bounds.width,
            height: bounds.height,
            position: 'fixed',
            zIndex: -99,
            visibility: 'hidden',
            pointerEvents: 'none'
          }}
        />
      </Menu.Target>
      <Menu.Dropdown>
        {showEditor
          ? <ColumnConfigForm
              column={column}
              onSubmit={onUpdate}
              loading={updateColumn.isLoading || resetColumn.isLoading}
              onCancel={() => setShowEditor(false)}
            />
          : (
            <>
              <Menu.Item
                closeMenuOnClick={false}
                onClick={() => setShowEditor(true)}
              >
                Edit Column
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                onClick={deleteColumnConfirm}
              >
                Delete Column
              </Menu.Item>
            </>
            )}
      </Menu.Dropdown>
    </Menu>
  )
}
