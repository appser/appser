import { colors } from '../../theme/colors'

import type { ThemeComponent } from '../../types'

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
