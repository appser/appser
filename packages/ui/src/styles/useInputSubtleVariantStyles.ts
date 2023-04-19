import { createStyles } from '@mantine/core'

import { colors } from '../theme/colors'

export const useInputSubtleVariantStyles = createStyles((theme) => ({
  input: {
    backgroundColor: 'transparent',
    border: `1px solid transparent`,
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
      border: `1px solid ${colors[theme.colorScheme].border}`,
      boxShadow: '0 0 0 0 rgba(0,0,0,0.15), 0 .5px 0 0 rgba(0,0,0,0.05)'
    },
    '&:focus, &:focus-within': {
      border: `1px solid ${theme.fn.primaryColor(theme.colorScheme)}`,
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white
    }
  }
}))
