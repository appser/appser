import { Logo } from '@appser/ui'
import { Box, Flex, Paper, SimpleGrid, useMantineColorScheme } from '@appser/ui'
import { Outlet, redirect, useLoaderData, useOutletContext } from 'react-router-dom'
import { LanguageSelect } from 'web/components/common/LanguageSelect'
import { Sidebar } from 'web/components/common/Sidebar'
import { ThemeSelect } from 'web/components/common/ThemeSelect'
import { getAuthConfigQuery } from 'web/servers/auth/queries'
import { getInviteQuery } from 'web/servers/invitation/queries'
import { loadQueryData } from 'web/utils/loadQueryData'

import type { QueryClient } from '@tanstack/react-query'
import type { LoaderFunctionArgs } from 'react-router-dom'

export const loader = (queryClient: QueryClient) => async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const { pathname } = new URL(request.url)
  const invitationToken = url.searchParams.get('it')

  const [authConfig, invitation] = await Promise.all([
    loadQueryData(queryClient, getAuthConfigQuery()),
    invitationToken ? loadQueryData(queryClient, getInviteQuery({ invitationToken })) : undefined
  ])

  if (pathname !== '/signup' && !authConfig.isInitialize) {
    throw redirect('/signup')
  }

  if (pathname === '/invite' && invitation && !invitation.currentUser) {
    throw redirect(`/login?it=${invitationToken}`)
  }

  return { authConfig, invitation, invitationToken }
}

export default function Welcome() {
  const context = useLoaderData()
  const { colorScheme } = useMantineColorScheme()

  return (
    <Paper
      component={Flex}
      h='100vh'
      w='100vw'
      direction='column'
      justify="center"
      align="center"
      sx={theme => ({
        backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[1] : theme.colors.dark[8]
      })}
    >
      <Paper component={Flex} w={585} mih={365} withBorder radius="md" shadow="md" style={{ overflow: 'hidden' }}>
        <Sidebar
          w={255}
          component={Flex}
          direction="column"
          justify="space-between"
        >
          <Box p='xl'>
            <Logo colorScheme={colorScheme} />
          </Box>
          <SimpleGrid cols={1} p='lg' mb={3}>
            <ThemeSelect size='xs' />
            <LanguageSelect size='xs' />
          </SimpleGrid>
        </Sidebar>
        <Outlet context={context} />
      </Paper>
    </Paper>
  )
}

export const useWelcomeContext = () => useOutletContext<Awaited<ReturnType<ReturnType<typeof loader>>>>()
