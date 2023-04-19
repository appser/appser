import { ActionIcon } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons'
import { forwardRef } from 'react'

import type { ActionIconProps } from '@mantine/core'
import type { ComponentPropsWithoutRef } from 'react'

interface ActionButtonProps extends ActionIconProps, Omit<ComponentPropsWithoutRef<'button'>, 'color'> {
  withChevronDown?: boolean
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(({ withChevronDown, children, ...rest }, ref) => {
  return (
    <ActionIcon w="auto"
      ref={ref}
      sx={(theme) => ({
        fontSize: theme.fontSizes.sm,
        paddingLeft: 7,
        paddingRight: 7
      })}
      {...rest}
    >
      {children}
      {withChevronDown && <IconChevronDown size={15} stroke={2.5} />}
    </ActionIcon>
  )
})
