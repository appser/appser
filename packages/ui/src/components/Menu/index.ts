import type { ThemeComponent } from '../../types'

export const Menu: ThemeComponent = {
  defaultProps: {
    transitionProps: {
      duration: 0
    },
    withArrow: false
  },
  styles(theme) {
    return {
      dropdown: {
        boxShadow: theme.shadows.lg
        // backgroundColor: theme.colorScheme === 'dark' ? undefined : theme.fn.rgba(theme.colors.gray[0], 0.5)
      },
      item: {
        paddingTop: 8,
        paddingBottom: 8
      }

    }
  }
}
