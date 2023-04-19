import { Box, Flex } from '@mantine/core'

import { Logomark } from './Logomark'
import { Wordmark } from './Wordmark'

import type { ColorScheme } from '@mantine/core'
import type { FC } from 'react'

interface Props {
  colorScheme?: ColorScheme
}

export const Logo: FC<Props> = ({ colorScheme }) => {
  return (
    <Flex align="center" gap={9}>
      <Logomark />
      <Box mt={4}>
        <Wordmark colorScheme={colorScheme} />
      </Box>
    </Flex>
  )
}
