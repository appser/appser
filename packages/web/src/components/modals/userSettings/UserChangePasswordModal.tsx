import { Button, Flex, Group, PasswordInput, hasLength, useDisclosure, useForm } from '@appser/ui'
import { useTranslation } from 'react-i18next'
import { useChangeAccountPassword } from 'web/hooks/account/useChangeAccountPassword'
import { useGetAccount } from 'web/hooks/account/useGetAccount'

import type { ContextModalProps } from '@appser/ui'

export function UserChangePasswordModal({ context, id }: ContextModalProps) {
  const { t } = useTranslation()
  const { data: user } = useGetAccount()
  const [visiblePassword, { toggle }] = useDisclosure(false)
  const changePassword = useChangeAccountPassword()

  const form = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validate: {
      oldPassword: hasLength({ min: 1 }),
      newPassword: hasLength({ min: 6 }, t('modal.userChangePassword.invalidPassword')),
      confirmPassword: (v, values) => v !== values.newPassword ? t('modal.userChangePassword.passwordsNotMatch') : null
    }
  })

  const onChangePassword = (values: typeof form.values) => {
    changePassword.mutate(
      {
        requestBody: {
          oldPwd: values.oldPassword,
          newPwd: values.newPassword
        }
      },
      {
        onSuccess: () => {
          context.closeModal(id)
        }
      }
    )
  }

  return (
    <Flex direction="column" gap="md">
      <form onSubmit={form.onSubmit(onChangePassword)}>
        <PasswordInput
          label={t('modal.userChangePassword.oldPassword')}
          {...form.getInputProps('oldPassword')}
          mt="sm"
        />
        <PasswordInput
          label={t('modal.userChangePassword.newPassword')}
          {...form.getInputProps('newPassword')}
          mt="sm"
          visible={visiblePassword}
          onVisibilityChange={toggle}
        />
        <PasswordInput
          label={t('modal.userChangePassword.confirmPassword')}
          {...form.getInputProps('confirmPassword')}
          mt="sm"
          visible={visiblePassword}
          onVisibilityChange={toggle}
        />
        <Group position='right'>
          <Button w={120} loading={changePassword.isLoading} type="submit" mt="lg">
            {t('modal.userChangePassword.update')}
          </Button>
        </Group>
      </form>
    </Flex>
  )
}
