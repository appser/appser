import { hasLength, useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { FormSection } from 'web/components/common/FormSection'
import { openUserChangePassword } from 'web/components/modals'
import { useChangeAccountPassword } from 'web/servers/account/useChangeAccountPassword'

import { UserSettingsContainer } from './UserSettingsContainer'

import type { FC } from 'react'

export const UserSettingsAccountChangePassword: FC = () => {
  const { t } = useTranslation()
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
        }
      }
    )
  }

  return (
    <UserSettingsContainer title="Change Password">
      <FormSection>
        <FormSection.Item label={t('modal.userSettings.account.changePassword')} onClick={() => openUserChangePassword()}>
          11
        </FormSection.Item>
      </FormSection>
    </UserSettingsContainer>
  )
}
