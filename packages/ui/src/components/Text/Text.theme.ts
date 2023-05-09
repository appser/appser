import { colors } from 'ui/theme/colors'

import type { ThemeComponent } from 'ui/types'

export const Text: ThemeComponent = {
  styles(theme, { color }) {
    const { colorScheme } = theme

    return {
      root: {
        color: color || colors[colorScheme].text
      }
    }
  }
}
