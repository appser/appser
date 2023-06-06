import { ActionIcon, Flex } from '@appser/ui'
import { IconArrowsDiagonal } from '@tabler/icons'
import { useGridSelection } from '../hooks/useGridSelection'


import type { FC } from 'react'
import type { Cell } from './Cell'
import { CompactSelection } from '@glideapps/glide-data-grid'

interface Props {
  cell: Cell
}

export const RowExpandFloatingIcon: FC<Props> = ({ cell }) => {
  const { bounds, row } = cell
  const { setSelection } = useGridSelection()

  return (
    <Flex
      sx={{
        top: bounds.y,
        left: 0,
        width: 26,
        height: bounds.height,
        position: 'absolute',
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
        onClick={() => {
          let newRows = CompactSelection.empty()
          
          setSelection(cv => (
            {
              ...cv,
              rows: newRows.add([row.rowIndex, row.rowIndex + 1]),
              current: undefined
            }
          ))
        }}
      >
        <IconArrowsDiagonal size={14} />
      </ActionIcon>
    </Flex>
  )
}
