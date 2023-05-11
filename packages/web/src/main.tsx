import { UIProvider } from '@appser/ui'
import { ModalsProvider } from '@appser/ui/modals'
import { Notifications } from '@appser/ui/notifications'
import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { LoaderFallback } from './components/common/LoaderFallback'
import modals from './components/modals'
import useCustomColorScheme from './hooks/useImprovedColorScheme'
import router from './router'
import queryClient from './vendor/queryClient'

import './vendor/i18n'

function App() {
  const { colorScheme, toggleColorScheme } = useCustomColorScheme()

  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
        theme={{
          globalStyles: () => ({
            'button, .mantine-NavLink-root, .mantine-Select-input': {
              cursor: 'default !important'
            }
          })
        }}
      >
        <ModalsProvider modals={modals}>
          <Notifications position='top-center' zIndex={2077} />
          <RouterProvider router={router} fallbackElement={<LoaderFallback />} />
        </ModalsProvider>
      </UIProvider>
    </QueryClientProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
