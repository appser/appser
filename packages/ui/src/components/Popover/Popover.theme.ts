import type { ThemeComponent } from 'ui/types'

export const Popover: ThemeComponent = {
  defaultProps: {
    radius: 'sm',
    transitionProps: {
      transition: 'scale'
    }
  },
  styles(theme, params) {
    return {
      dropdown: {
        boxShadow: theme.shadows.lg
      }
    }
  }
}
