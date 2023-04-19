import { mantineTheme } from '@appser/ui'
import { ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { LoaderFallback } from './components/common/LoaderFallback'
import modals from './components/modals'
import useCustomColorScheme from './hooks/useImprovedColorScheme'
import router from './router'
import queryClient from './vendor/queryClient'

import type { MantineThemeOverride } from '@mantine/core'

import './vendor/i18n'

const theme: MantineThemeOverride = {
  ...mantineTheme,
  globalStyles: () => ({
    'button, .mantine-NavLink-root, .mantine-Select-input': {
      cursor: 'default !important'
    }
  })
}

function App() {
  const { colorScheme, toggleColorScheme } = useCustomColorScheme()

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{
          ...theme,
          colorScheme
        }}
          withGlobalStyles
          withNormalizeCSS
        >
          <ModalsProvider modals={modals}>
            <Notifications position='top-center' zIndex={2077} />
            <RouterProvider router={router} fallbackElement={<LoaderFallback />} />
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
