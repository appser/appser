import { Anchor, Button, Flex, Group, PasswordInput, Text, TextInput, Title } from '@appser/ui'
import { hasLength, isEmail, useForm } from '@appser/ui/form'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import db from 'web/vendor/db'

import { useWelcomeContext } from './_welcome'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const { authConfig, invitation, invitationToken } = useWelcomeContext()
  const allowSignup = !!(authConfig.signup === 'always' || (authConfig.signup === 'onlyByInvite' && invitation))

  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: isEmail(t('page.login.error.invalidEmail')),
      password: hasLength({ min: 6 }, t('page.login.error.invalidPassword'))
    }
  })

  const signup = () => {
    if (invitationToken) {
      return navigate(`/signup?it=${invitationToken}`)
    } else {
      return navigate(`/signup`)
    }
  }

  const login = useMutation({
    mutationFn: (body: typeof form.values) => {
      return db.auth.authByEmail({
        requestBody: {
          ...body,
          setCookie: true
        }
      })
    },
    onSuccess: data => {
      if (invitationToken) {
        return navigate(`/invite?it=${invitationToken}`)
      } else {
        return navigate(from, { replace: true })
      }
    }
  })

  return (
    <Flex direction="column" w="100%" p="xl">
      <Title order={3} mb='5px'>{t('page.login.title')}</Title>
      {invitation && (
        <Text size="sm" color="gray">
          {t('page.login.subtitleWithInviter', {
            inviter: invitation.inviter.name,
            org: 'appser'
          })}
        </Text>
      )}
      <form onSubmit={form.onSubmit(values => login.mutate(values))}>
        <TextInput label={t('page.login.email')} {...form.getInputProps('email')} mt='sm' />
        <PasswordInput label={t('page.login.password')} {...form.getInputProps('password')} mt="sm" />

        <Group position='apart' mt="lg">
          {allowSignup
            ? (
              <Anchor<'a'>
                color="primary"
                fw="bold"
                onClick={(event) => {
                  event.preventDefault()
                  signup()
                }}
                size="sm"
              >
                {t('page.login.signUp')}
              </Anchor>
              )
            : <Text />}
          <Button w={120} loading={login.isLoading} type="submit">
            {t('page.login.signIn')}
          </Button>
        </Group>
      </form>
    </Flex>
  )
}
