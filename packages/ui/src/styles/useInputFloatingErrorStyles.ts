import type { CSSObject, MantineTheme } from '@mantine/core'

export const useInputFloatingErrorStyles = (theme: MantineTheme): Record<string, CSSObject> => {
  const { colorScheme, white, radius, spacing, other, shadows, colors } = theme

  return {
    root: {
      position: 'relative'
    },
    error: {
      position: 'absolute',
      whiteSpace: 'nowrap',
      backgroundColor: colors.red[0],
      borderRadius: radius.sm,
      padding: `0 ${spacing.sm}`,
      height: 40,
      lineHeight: '40px',
      zIndex: 2,
      bottom: -45,
      border: `1px solid ${theme.fn.themeColor('red')}`,
      boxShadow: shadows.xs,
      '&:before': {
        content: "''",
        width: 7,
        height: 7,
        transform: 'rotate(45deg)',
        position: 'absolute',
        borderTopLeftRadius: 0,
        top: -3,
        borderBottom: 0,
        borderRight: 0,
        left: 20,
        backgroundColor: 'inherit',
        border: 'inherit',
        zIndex: 1
      },
      '&:after': {
        content: "''",
        width: 11,
        height: 11,
        backgroundColor: 'inherit',
        position: 'absolute',
        left: 18,
        top: 0,
        zIndex: 1
      }
    }
  }
}
