import { Box, Flex } from '@appser/ui'

import type { BoxProps } from '@appser/ui'
import type { FC } from 'react'

interface Props extends BoxProps {
  children?: React.ReactNode
  withBottomBorder?: boolean
}

export const NavHeader: FC<Props> = ({ children, withBottomBorder = true, ...rest }) => {
  return (
    <Box
      h={50}
      component={Flex}
      align="center"
      sx={({ colorScheme, colors }) => ({
        flex: '0 0 auto',
        borderBottom: withBottomBorder
          // ? `1px solid ${theme.other.color[theme.colorScheme].divider}`
          ? `1px solid ${colorScheme === 'light' ? colors.gray[2] : colors.dark[5]}`
          : undefined
      })}
      {...rest}
    >
      {children}
    </Box>
  )
}
