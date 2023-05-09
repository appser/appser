import { Box, createPolymorphicComponent, createStyles } from '@appser/ui'
import { forwardRef } from 'react'

import type { BoxProps } from '@appser/ui'

const useStyles = createStyles(({ colorScheme, colors }) => ({
  sidebar: {
    backgroundColor: colorScheme === 'light' ? colors.gray[0] : colors.dark[6],
    borderRight: `1px solid ${colorScheme === 'dark' ? colors.dark[8] : colors.gray[2]}`
  }
}))

const _Sidebar = forwardRef<HTMLDivElement, BoxProps>(({ children, className, ...others }, ref) => {
  const { classes, cx } = useStyles()

  return (
    <Box
      className={cx(classes.sidebar, className)}
      ref={ref}
      {...others}
    >
      {children}
    </Box>
  )
})

export const Sidebar = createPolymorphicComponent<'div', BoxProps>(_Sidebar)
