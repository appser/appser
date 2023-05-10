import { colors as uiColors, useMantineTheme } from '@appser/ui'

import type { Theme } from '@glideapps/glide-data-grid'

export function useGridTheme(): Partial<Theme> {
  const { colorScheme, colors, other, fn, primaryColor } = useMantineTheme()

  const lightTheme: Partial<Theme> = {
    accentColor: colors[primaryColor][6],
    headerIconSize: 16,
    bgIconHeader: '#b8b8b8',
    fgIconHeader: '#444'
  }

  const darkTheme: Partial<Theme> = {
    accentColor: colors[primaryColor][6],
    accentLight: fn.rgba(colors.dark[5], 0.5),

    textDark: '#ffffff',
    // textMedium: '#b8b8b8',
    textLight: '#a0a0a0',
    textBubble: '#ffffff',

    bgIconHeader: '#b8b8b8',
    fgIconHeader: '#000000',
    textHeader: colors.gray[4],
    // textHeaderSelected: '#000000',

    bgCell: colors.dark[8],
    // bgCellMedium: '#202027',
    bgHeader: colors.dark[6],
    bgHeaderHasFocus: colors.dark[4],
    bgHeaderHovered: colors.dark[4],

    // bgBubble: '#212121',
    // bgBubbleSelected: '#000000',

    borderColor: uiColors.dark.border
    // drilldownBorder: 'rgba(225,225,225,0.4)',

    // linkColor: '#4F5DFF'

  }

  return colorScheme === 'light' ? lightTheme : darkTheme
}
