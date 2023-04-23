import { colors } from '@appser/ui'
import { Button, Group, Space } from '@mantine/core'
import { ThemeSelect } from 'web/components/common/ThemeSelect'
import { IconPlusCircle } from 'web/components/icons/IconPlusCircle'

import { ToolbarFilterButton } from './ToolbarFilterButton'
import { ToolbarSortButton } from './ToolbarSortButton'
import { ColumnSettingsButton } from '../column/ColumnSettingsButton'

import type { FC } from 'react'

interface Props {
  onClickCreate: () => void
}

export const GridToolbar: FC<Props> = ({ onClickCreate }) => {
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
        onClick={onClickCreate}
        variant='default'
        size="xs"
      >
        New Record
      </Button>
      <Space w={20} />
      <ToolbarFilterButton />
      <ToolbarSortButton />
      <ColumnSettingsButton />
      <ThemeSelect />
    </Group>
  )
}
