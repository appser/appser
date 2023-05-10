import { Menu } from '@appser/ui'
import { useDeleteRecord } from 'web/hooks/dataset/useDeleteRecord'

import type { MenuProps } from '@appser/ui'
import type { Rectangle } from '@glideapps/glide-data-grid'
import type { FC } from 'react'
import type { Row } from 'web/components/views/SheetView/row/Row'

interface RowMenuProps extends MenuProps {
  datasetId: string
  row: Row
  bounds: Rectangle
}

export const RowMenu: FC<RowMenuProps> = ({ row, datasetId, bounds, onClose, ...rest }) => {
  const deleteRow = useDeleteRecord(datasetId, row.record.id)

  const onDelete = () => {
    deleteRow.mutate()
  }

  return (
    <Menu position='bottom-start' offset={0} onClose={onClose} {...rest}>
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
        <Menu.Item>Preview</Menu.Item>
        <Menu.Item>Edit Cell</Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" onClick={onDelete}>Delete Row</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
