import type { ThemeComponent } from '../../types'

export const Modal: ThemeComponent = {
  defaultProps: {
    transitionProps: {
      transition: 'pop',
      duration: 400,
      exitDuration: 200,
      timingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
    },
    overlayProps: {
      color: 'black',
      opacity: 0.3
    },
    centered: true
  },
  styles(theme) {
    return {
      content: {
        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.dark[1]}`,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadows.xl
      },
      title: {
        fontWeight: 'bold'
      }
    }
  }
}
