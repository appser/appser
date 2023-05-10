import { Button, Group, Space, colors } from '@appser/ui'
import { ThemeSelect } from 'web/components/common/ThemeSelect'
import { IconPlusCircle } from 'web/components/icons/IconPlusCircle'

import { ToolbarFieldButton } from './ToolbarFieldButton'
import { ToolbarFilterButton } from './ToolbarFilterButton'
import { ToolbarSortButton } from './ToolbarSortButton'

import type { FC } from 'react'

interface Props {
  onHandleCreate: () => void
}

export const SheetToolbar: FC<Props> = ({ onHandleCreate }) => {
  return (
    <Group
      sx={theme => ({
        borderBottom: `1px solid ${colors[theme.colorScheme].border}`,
        flex: '0 0 44px'
      })}
      px="xs"
      h={44}
      align="center"
    >
      <Button
        leftIcon={<IconPlusCircle size={14} />}
        onClick={onHandleCreate}
        variant='default'
        size="xs"
      >
        New Record
      </Button>
      <Space w={20} />
      <ToolbarFilterButton />
      <ToolbarSortButton />
      <ToolbarFieldButton />
      <ThemeSelect />
    </Group>
  )
}
