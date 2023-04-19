import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Box, Flex, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { AppCreatorButton } from 'web/components/app/AppCreatorButton'
import { AppGridItem } from 'web/components/app/AppGridItem'
import { NavHeader } from 'web/components/common/NavHeader'
import { listOrgAppQuery } from 'web/servers/org/queries'
import { useListOrgApp } from 'web/servers/org/useListOrgApp'

import type { QueryClient } from '@tanstack/react-query'
import type { LoaderFunctionArgs } from 'react-router-dom'

export const loader = (queryClient: QueryClient) => async ({ request, params }: LoaderFunctionArgs) => {
  const { orgId = '' } = params
  queryClient.prefetchQuery(listOrgAppQuery({ orgId }))

  return null
}

export default function OrgIdApps() {
  const { t } = useTranslation()
  const { orgId = '' } = useParams<{ orgId: string }>()
  const { data: apps } = useListOrgApp({ orgId })
  const [parent] = useAutoAnimate()

  return (
    <Flex direction="column" sx={{ flex: 1 }}>
      <NavHeader px='lg'>
        <Title order={5} ml='sm'>{t('page.home.orgs.-.apps.title')}</Title>
      </NavHeader>
      <Flex direction="column" px={32} py="lg" sx={{ flex: 1, overflow: 'scroll' }}>
        <AppCreatorButton />
        <Text size="sm" my="lg">Last created</Text>
        <Flex gap="xl" align="flex-start" wrap='wrap' ref={parent}>
          {apps?.map(app => (
            <AppGridItem key={app.id} app={app} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}
