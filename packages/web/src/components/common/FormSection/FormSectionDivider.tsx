import { colors } from '@appser/ui'
import { Divider } from '@mantine/core'

import type { DividerProps } from '@mantine/core'
import type { FC } from 'react'

export const FormSectionDivider: FC<DividerProps> = (p) => (
  <Divider
    sx={theme => ({
      borderTopColor: colors[theme.colorScheme].border
    })}
    {...p}
  />
)
