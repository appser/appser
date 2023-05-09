import { ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { mantineTheme } from 'ui/theme'

import type { ColorScheme, MantineProviderProps } from '@mantine/core'
import type { FC } from 'react'

interface UIProviderProps extends MantineProviderProps {
  toggleColorScheme: (colorScheme: ColorScheme | undefined) => void
  colorScheme: ColorScheme
}

export const UIProvider: FC<UIProviderProps> = ({ children, toggleColorScheme, colorScheme, theme, ...props }) => {
  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{
        ...mantineTheme,
        colorScheme,
        ...theme
      }}
        withGlobalStyles
        withNormalizeCSS
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  )
}
