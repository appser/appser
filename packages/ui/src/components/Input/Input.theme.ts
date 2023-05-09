import { rem } from '@mantine/core'
import { useInputFloatingErrorStyles } from 'ui/styles/useInputFloatingErrorStyles'

import type { ThemeComponent } from 'ui/types'

export const Input: ThemeComponent = {
  styles(theme) {
    return {
      ...useInputFloatingErrorStyles(theme),
      wrapper: {
        marginBottom: 0
      }
    }
  },
  variants: {
    filled: (theme) => ({
      input: {
        border: `${rem(1)} solid transparent`,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        '&:focus, &:focus-within': theme.focusRingStyles.inputStyles(theme),
        ...theme.fn.hover({
          backgroundColor: theme.colors.gray[3]
        })
      }
    })
  }
}
