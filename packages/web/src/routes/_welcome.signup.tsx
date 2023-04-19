import { Button, Flex, Group, PasswordInput, TextInput, Title } from '@mantine/core'
import { hasLength, isEmail, useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import db from 'web/vendor/db'

import { useWelcomeContext } from './_welcome'

export default function Signup() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { invitationToken } = useWelcomeContext()
  const [visiblePassword, { toggle }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validate: {
      name: hasLength({ min: 2 }, t('page.signup.invalidName')),
      email: isEmail(t('page.signup.invalidEmail')),
      password: hasLength({ min: 6 }, t('page.signup.invalidPassword')),
      confirmPassword: (v, values) => v !== values.password ? t('page.signup.passwordsNotMatch') : null
    }
  })

  const signup = useMutation({
    mutationFn: async (body: typeof form.values) => {
      await db.signup.signupByEmail({
        requestBody: {
          ...body,
          invitationToken
        }
      })

      return await db.auth.authByEmail({
        requestBody: {
          email: body.email,
          password: body.password,
          setCookie: true
        }
      })
    },
    onSuccess: data => {
      if (invitationToken) {
        return navigate(`/invite?it=${invitationToken}`)
      }

      return navigate('/org/create')
    }
  })

  return (
    <Flex direction="column" w="100%" p="xl">
      <Title order={3} mb='5px'>{t('page.signup.title')}</Title>
      <form onSubmit={form.onSubmit(values => signup.mutate(values))}>
        <TextInput label={t('page.signup.name')} {...form.getInputProps('name')} mt='sm' />
        <TextInput label={t('page.signup.email')} {...form.getInputProps('email')} mt='sm' />
        <PasswordInput
          label={t('page.signup.password')}
          {...form.getInputProps('password')}
          mt="sm"
          visible={visiblePassword}
          onVisibilityChange={toggle}
        />
        <PasswordInput
          label={t('page.signup.confirmPassword')}
          {...form.getInputProps('confirmPassword')}
          mt="sm"
          visible={visiblePassword}
          onVisibilityChange={toggle}
        />
        <Group position='right'>
          <Button w={120} loading={signup.isLoading} type="submit" mt="lg">
            {t('page.signup.signUp')}
          </Button>
        </Group>
      </form>
    </Flex>
  )
}
