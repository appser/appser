import { ActionIcon, Flex } from '@appser/ui'
import { GridCellKind } from '@glideapps/glide-data-grid'
import { IconEdit2 } from 'web/components/icons/IconEdit2'
import useAccess from 'web/hooks/ui/useAccess'
import { useActivateApp } from 'web/hooks/ui/useActivateApp'
import { useActivateDataset } from 'web/hooks/ui/useActivateDataset'

import { useFieldsConfig } from '../fields'
import { useEditingCell } from '../hooks/useEditingCell'
import { useScrollDirection } from '../hooks/useScrollDirection'

import type { Cell } from './Cell'
import type { FC } from 'react'

interface Props {
  cell: Cell
}

export const CellEditorFloatingIcon: FC<Props> = ({ cell }) => {
  const { row, field, bounds, gridCell } = cell
  const { isScrolling } = useScrollDirection()
  const fields = useFieldsConfig()
  const [app] = useActivateApp()
  const [dataset] = useActivateDataset()
  const { can } = useAccess()
  const [editingCell, setEditingCell] = useEditingCell()
  if (!field) return null
  
  
  const FieldCellEditor = fields[field.type].CellEditor
  const { allow: allowEdit } = can('app:dataset:record:field:update', {
    appId: app?.id ?? '',
    datasetId: dataset?.id ?? '',
    recordId: row.record.id,
    fieldName: field.name
  })
  const showIcon = !isScrolling && allowEdit && !editingCell && FieldCellEditor && gridCell.kind !== GridCellKind.Boolean

  if (!showIcon) return null

  return (
    <Flex
      sx={{
        top: bounds.y,
        left: bounds.x,
        width: bounds.width,
        height: bounds.height,
        position: 'fixed',
        backgroundColor: 'transparent',
        zIndex: 99,
        justifyContent: 'flex-end',
        alignItems: 'center',
        pointerEvents: 'none'
      }}
    >
      <ActionIcon
        sx={{ pointerEvents: 'auto' }}
        size='sm'
        mr={3}
        onClick={() => setEditingCell(cell)}
      >
        <IconEdit2 size={14} />
      </ActionIcon>
    </Flex>
  )
}
