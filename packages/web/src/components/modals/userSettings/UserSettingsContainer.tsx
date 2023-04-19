import { Box, Flex, Title, createStyles } from '@mantine/core'

import type { PropsWithChildren, ReactNode } from 'react'

interface PanelContainerProps extends PropsWithChildren {
  title?: ReactNode
  footer?: ReactNode
}
const useTabsPanelContainerStyles = createStyles(theme => ({
  body: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.lg,
    flex: 1,
    overflow: 'scroll'
  },
  title: {
    fontSize: theme.fontSizes.md,
    paddingLeft: `calc(${theme.spacing.lg} + ${theme.spacing.sm})`,
    paddingRight: theme.spacing.lg,
    fontWeight: 600,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md
  },
  footer: {
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    justifyContent: 'flex-end'
  }
}))

export function UserSettingsContainer({ title, children, footer }: PanelContainerProps) {
  const { classes } = useTabsPanelContainerStyles()

  return (
    <>
      <Title className={classes.title}>{title}</Title>
      <Box className={classes.body}>
        {children}
      </Box>
      {footer && <Flex className={classes.footer}>{footer}</Flex>}
    </>

  )
}
