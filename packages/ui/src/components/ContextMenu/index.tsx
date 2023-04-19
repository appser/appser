import { Menu, rem } from '@mantine/core'
import { useMemo, useState } from 'react'

import { ContextMenuContext } from './ContextMenu.context'
import { ContextMenuTarget } from './ContextMenuTarget'

import type { MenuProps } from '@mantine/core'

export const ContextMenu = ({ children, opened, onClose, ...rest }: MenuProps) => {
  const [status, setStatus] = useState({
    isOpen: false,
    clientX: -999,
    clientY: -999
  })
  const providerValue = useMemo(() => ({
    status,
    setStatus
  }), [status, setStatus])

  return (
    <ContextMenuContext.Provider value={providerValue}>
      <Menu
        styles={theme => ({
          dropdown: {
            borderRadius: theme.radius.sm
          },
          item: {
            paddingTop: `calc(${theme.spacing.xs} - ${rem(2)})`,
            paddingBottom: `calc(${theme.spacing.xs} - ${rem(2)})`
          }
        })}
        position='bottom-start'
        offset={3}
        opened={status.isOpen}
        onClose={() => {
          setStatus(prev => ({
            ...prev,
            isOpen: false
          }))
          onClose?.()
        }}
        {...rest}
      >
        <Menu.Target>
          <div
            style={{
              left: status.clientX,
              top: status.clientY,
              width: 0,
              height: 0,
              position: 'fixed',
              zIndex: -99,
              visibility: 'hidden',
              pointerEvents: 'none',
              backgroundColor: 'transparent'
            }}
          />
        </Menu.Target>
        {children}
      </Menu>
    </ContextMenuContext.Provider>
  )
}

ContextMenu.Target = ContextMenuTarget
ContextMenu.Dropdown = Menu.Dropdown
ContextMenu.Item = Menu.Item
ContextMenu.Divider = Menu.Divider
ContextMenu.Label = Menu.Label
