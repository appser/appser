import { Box, Button, Center, Flex, Group, Text, Title, createStyles } from '@appser/ui'
import { useMutation } from '@tanstack/react-query'
import get from 'lodash/get'
import { AlertOctagon } from 'react-feather'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate, useRouteError } from 'react-router-dom'
import { OrgLogo } from 'web/components/org/OrgLogo'
import { setLastOrgId } from 'web/servers/org/utils'
import db from 'web/vendor/db'

import { useWelcomeContext } from './_welcome'

const useStyles = createStyles((theme) => ({
  org: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[0]
  }
}))

export default function Invite() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { classes } = useStyles()
  const { invitation, invitationToken } = useWelcomeContext()

  const accept = useMutation({
    mutationFn: async () => {
      if (!invitationToken) return

      return db.invite.acceptInvitation({
        requestBody: {
          invitationToken
        }
      })
    },
    onSuccess: () => {
      if (!invitation) return
      const orgId = invitation.org?.id

      if (orgId) {
        setLastOrgId(orgId)
        navigate('/')
      }
    }
  })

  if (!invitation || !invitation.org) throw new Error('No invitation')

  return (
    <Flex direction="column" w="100%" p='lg' justify="center" align="center">
      <Center mb="xl">
        <OrgLogo org={invitation.org} size='lg' />
      </Center>
      <Title order={5} ta="center" mb="xs">
        <Trans i18nKey="page.invite.title" values={{ org: invitation.org.name }} />
      </Title>
      <Text size="sm" color="dimmed" mb='xl'>{t('page.invite.subTitle', { inviter: invitation.inviter.name })}</Text>
      <Group spacing="xl">
        <Button variant='default' onClick={() => navigate('/')}>{t('page.invite.back')}</Button>
        <Button loading={accept.isLoading} onClick={() => accept.mutate()}>{t('page.invite.accept')}</Button>
      </Group>
    </Flex>
  )
}

export function ErrorBoundary() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const error = useRouteError()
  const code = get(error, 'body.error.code')

  return (
    <Flex direction="column" w="100%" p='xl' justify="center" align="center">
      <Box mb="lg">
        <AlertOctagon size={50} />
      </Box>
      <Title order={3} mb='5px'>
        {code === 'invite.tokenExpired'
          ? t('page.invite.expiredLinkTitle')
          : t('page.invite.brokenLinkTitle')}
      </Title>
      <Text size="sm" color="gray" mb="lg" ta='center'>
        {t('page.invite.warnSubTitle')}
      </Text>
      <Button onClick={() => navigate('/')}>Go back to home</Button>
    </Flex>
  )
}
