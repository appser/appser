import { Box } from '@appser/ui'

import type { BoxProps, MantineTheme } from '@appser/ui'
import type { FC } from 'react'

interface PaperBackgroundProps extends BoxProps {
  withBgColor?: 'primary' | 'secondary' | 'tertiary'
}

const colors = ({ colors }: MantineTheme) => ({
  light: {
    primary: colors.gray[0],
    secondary: colors.gray[1],
    tertiary: colors.gray[2]
  },
  dark: {
    primary: colors.dark[6],
    secondary: colors.dark[7],
    tertiary: colors.dark[8]
  }
})

export const Background: FC<PaperBackgroundProps> = ({ withBgColor = 'primary', ...rest }) => {
  return (
    <Box sx={theme => ({
      backgroundColor: colors(theme)[theme.colorScheme][withBgColor]
    })}
      {...rest}
    />
  )
}
