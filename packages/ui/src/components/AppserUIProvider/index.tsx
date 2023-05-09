import { ColorSchemeProvider, MantineProvider } from '@mantine/core'

import { mantineTheme } from '../../theme'

import type { ColorScheme, MantineProviderProps } from '@mantine/core'
import type { FC } from 'react'

interface AppserUIProviderProps extends MantineProviderProps {
  toggleColorScheme: (colorScheme: ColorScheme | undefined) => void
  colorScheme: ColorScheme
}

export const AppserUIProvider: FC<AppserUIProviderProps> = ({ children, toggleColorScheme, colorScheme, theme, ...props }) => {
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
