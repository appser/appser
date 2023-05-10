import { ActionIcon, Popover } from '@appser/ui'

import { AppNavbar } from './AppNavbar'
import { IconChevronDown } from '../icons/IconChevronDown'

import type { FC } from 'react'
import type { App } from 'web/types'

// TODO @tccsg

interface Props {
  app: App
}

export const AppNavbarPopover: FC<Props> = ({ app }) => {
  return (
    <Popover
      width={230}
      position="bottom-start"
      transitionProps={{
        duration: 0
      }}
      shadow="md"
      withinPortal
      styles={{
        dropdown: {
          padding: 0,
          overflow: 'hidden'
        }
      }}
    >
      <Popover.Target>
        <ActionIcon w={20} miw={20}>
          <IconChevronDown size={16} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <AppNavbar
          sx={theme => ({
            backgroundColor: theme.colorScheme === 'light' ? theme.white : theme.colors.dark[7]
          })}
          mah='70vh'
          h='auto'
        />
      </Popover.Dropdown>
    </Popover>
  )
}
