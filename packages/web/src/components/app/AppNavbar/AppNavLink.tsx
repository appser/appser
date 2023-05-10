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
    position: 'relative'
  },
  // label: {
  //   fontSize: theme.fontSizes.sm - 1
  // },
  icon: {
    marginRight: 6
  },
  rightSection: {
    position: 'absolute',
    left: -8
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
