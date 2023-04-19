import type { ThemeComponent } from '../../types'

export const Radio: ThemeComponent = {
  styles: (theme, { compact, size }) => {
    return {
      description: {
        fontSize: theme.fontSizes.sm

      }
    }
  }
}
