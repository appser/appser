import type { ThemeComponent } from 'ui/types'

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
