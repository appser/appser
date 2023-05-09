import { Text, UnstyledButton } from '@appser/ui'
import { forwardRef } from 'react'

import { IconSelector } from '../icons/IconSelector'

import type { ComponentPropsWithoutRef } from 'react'

interface SelectButtonProps extends ComponentPropsWithoutRef<'button'> {
  placeholder?: string
}

export const MenuButton = forwardRef<HTMLButtonElement, SelectButtonProps>(({ placeholder, children, ...rest }, ref) => {
  return (
    <UnstyledButton w="auto"
      miw={40}
      ref={ref}
      sx={(theme) => ({
        fontSize: theme.fontSizes.sm,
        alignContent: 'center',
        paddingLeft: 13,
        paddingRight: 2,
        height: 30,
        borderRadius: theme.radius.sm,
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        '&[aria-expanded = true]': {
          border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][6] : theme.colors[theme.primaryColor][5]}`,
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
          boxShadow: '0 0 0 0 rgba(0,0,0,0.15), 0 .5px 0 0 rgba(0,0,0,0.05)'
        },
        border: `1px solid transparent`,
        '&:hover': {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
          boxShadow: '0 0 0 0 rgba(0,0,0,0.15), 0 .5px 0 0 rgba(0,0,0,0.05)'
        }
      })}
      {...rest}
    >
      <Text color={children ? undefined : 'dimmed'}>
        {children ?? placeholder}
      </Text>
      <IconSelector size={16} />
    </UnstyledButton>
  )
})
