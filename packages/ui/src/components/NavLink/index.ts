import type { ThemeComponent } from '../../types'

export const NavLink: ThemeComponent = {
  styles: (theme) => {
    return {
      root: {
        borderRadius: 6
      },
      icon: {
        opacity: 0.75
      },
      label: {
        color: 'inherit'
      }
    }
  }
}
