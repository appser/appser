import React from 'react'
import {mantineTheme} from '../packages/ui'
import { MantineProvider,ColorSchemeProvider } from '@mantine/core'
import { useDarkMode } from 'storybook-dark-mode';


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

function ThemeWrapper(props: { children: React.ReactNode }) {
  const colorScheme = useDarkMode() ? 'dark' : 'light';

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={() => {}}>
      <MantineProvider theme={{ ...mantineTheme, colorScheme }} withNormalizeCSS withGlobalStyles>
        {props.children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}


export const decorators = [
  (Story) => (
    <ThemeWrapper>
      <Story />
    </ThemeWrapper>
  )
]
