import { ActionIcon, Flex } from '@appser/ui'
import { GridCellKind } from '@glideapps/glide-data-grid'
import { IconEdit2 } from 'web/components/icons/IconEdit2'
import useAccess from 'web/hooks/useAccess'
import { useActivatedApp } from 'web/hooks/useActivatedApp'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'

import { useFieldsConfig } from '../fields'
import { useActivatedCell } from '../hooks/useActivatedCell'

import type { ActivatedCell } from '../hooks/useActivatedCell'
import type { FC } from 'react'

interface Props extends ActivatedCell { }

export const CellEditFloatingIcon: FC<Props> = ({ bounds, cell, row, field, location }) => {
  const fields = useFieldsConfig()
  const [currentApp] = useActivatedApp()
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()
  const { can } = useAccess()
  const { allow: allowEdit } = can('app:dataset:view:record:field:update', {
    appId: currentApp?.id ?? '',
    datasetId: dataset?.id ?? '',
    viewId: view?.id ?? '',
    recordId: row.record.id,
    fieldName: field.name
  })
  const [activatedCell, setActivatedCell] = useActivatedCell()
  const CellEditor = fields[field.type].CellEditor
  const showIcon = allowEdit && !activatedCell && CellEditor && cell.kind !== GridCellKind.Boolean

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
        onClick={() => setActivatedCell({
          bounds,
          row,
          cell,
          field,
          location
        })}
      >
        <IconEdit2 size={14} />
      </ActionIcon>
    </Flex>
  )
}
