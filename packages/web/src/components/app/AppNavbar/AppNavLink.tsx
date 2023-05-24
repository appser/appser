import { NavLink, createStyles } from '@appser/ui'

import type { NavLinkProps } from '@appser/ui'
import type { FC } from 'react'

interface Props extends NavLinkProps {}

interface AppNavLinkStylesParams {}

const useStyles = createStyles((theme, _: AppNavLinkStylesParams) => ({
  root: {
    padding: '0 12px',
    paddingLeft: 20,
    height: 38,
    position: 'relative',
    '&[aria-menu-opened = true]': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
    },
    '& .targetButton': {
      display: 'none'
    },
    '& .targetButton[aria-menu-opened]': {
      display: 'flex',
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    },
    '&:hover .targetButton': {
      display: 'flex'
    }
  },

  icon: {
    marginRight: 6
  }
}))

export const AppNavLink: FC<Props> = ({ children, styles, classNames, ...props }) => {
  const { classes } = useStyles({}, { name: 'AppNavLink', classNames, styles })

  return (
    <NavLink
      component='div'
      {...props}
      classNames={classes}
    >
      {children}
    </NavLink>
  )
}
