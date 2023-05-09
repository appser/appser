import { em, rem } from '@mantine/core'

import components from './components'

import type { DefaultMantineColor, MantineThemeOverride, Tuple } from '@mantine/core'

export const mantineTheme: MantineThemeOverride = {
  colors: {
    appser: [
      '#e0e8da',
      '#ccdbc3',
      '#aacf97',
      '#89c26e',
      '#68b54a',
      '#49a92a',
      '#31821a',
      '#1c5c0e',
      '#0d3605',
      '#030f01'
    ]
  },
  primaryColor: 'appser',
  primaryShade: {
    light: 5,
    dark: 6
  },
  fontSizes: {
    xs: rem(12),
    sm: rem(13),
    md: rem(15),
    lg: rem(17),
    xl: rem(19)
  },
  radius: {
    xs: rem(4),
    sm: rem(6),
    md: rem(10),
    lg: rem(14),
    xl: rem(32)
  },
  spacing: {
    xs: rem(10),
    sm: rem(12),
    md: rem(16),
    lg: rem(20),
    xl: rem(24)
  },
  breakpoints: {
    xs: em(576),
    sm: em(768),
    md: em(992),
    lg: em(1200),
    xl: em(1400)
  },
  cursorType: 'default',
  headings: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
    fontWeight: 700,
    sizes: {
      h1: { fontSize: rem(34), lineHeight: 1.3, fontWeight: undefined },
      h2: { fontSize: rem(26), lineHeight: 1.35, fontWeight: undefined },
      h3: { fontSize: rem(22), lineHeight: 1.4, fontWeight: undefined },
      h4: { fontSize: rem(18), lineHeight: 1.45, fontWeight: undefined },
      h5: { fontSize: rem(16), lineHeight: 1.5, fontWeight: undefined },
      h6: { fontSize: rem(14), lineHeight: 1.5, fontWeight: undefined }
    }
  },
  components
}

type ExtendedCustomColors = 'primary' | DefaultMantineColor

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>
  }
}
