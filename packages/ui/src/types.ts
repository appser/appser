import type { CSSObject, ContextStylesParams, MantineTheme } from '@mantine/core'

export interface ThemeComponent {
  defaultProps?: Record<string, any>
  classNames?: Record<string, string>
  styles?: Record<string, CSSObject> | ((theme: MantineTheme, params: any) => Record<string, CSSObject>)
  variants?: Record<
    PropertyKey,
    (theme: MantineTheme, params: any, context: ContextStylesParams) => Record<string, CSSObject>
  >
  sizes?: Record<
    PropertyKey,
    (theme: MantineTheme, params: any, context: ContextStylesParams) => Record<string, CSSObject>
  >
}
