import { colors } from 'ui/theme/colors'

import type { ThemeComponent } from 'ui/types'

export const ActionIcon: ThemeComponent = {
  styles({ colorScheme, colors: mantineColors, other }, { variant }) {
    return {
      root: variant === 'subtle'
        ? {
            color: colors[colorScheme].icon,
            '&:hover': {
              backgroundColor: colorScheme === 'dark' ? mantineColors.dark[6] : 'rgba(0,0,0,0.05)'
            }
          }
        : {}
    }
  }
}
