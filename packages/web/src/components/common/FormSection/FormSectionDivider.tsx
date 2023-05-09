import { colors } from '@appser/ui'
import { Divider } from '@appser/ui'

import type { DividerProps } from '@appser/ui'
import type { FC } from 'react'

export const FormSectionDivider: FC<DividerProps> = (p) => (
  <Divider
    sx={theme => ({
      borderTopColor: colors[theme.colorScheme].border
    })}
    {...p}
  />
)
