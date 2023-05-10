import { Button, Flex, Title, useForm } from '@appser/ui'
import { useGetAccount } from 'web/hooks/account/useGetAccount'
import { useUpdateAccountProfile } from 'web/hooks/account/useUpdateAccountProfile'

import { UserSettingsContainer } from './UserSettingsContainer'
import { FormSection } from '../../common/FormSection'
import { UserAvatar } from '../../user/UserAvatar'

export const UserSettingsProfile = () => {
  const { data: user } = useGetAccount()
  const updateAccount = useUpdateAccountProfile()

  const profileForm = useForm({
    initialValues: {
      name: user?.name
    }
  })

  const onSave = () => {
    updateAccount.mutate({
      requestBody: profileForm.values
    })
  }

  if (!user) return null

  return (
    <UserSettingsContainer
      title={user?.name}
      footer={<Button loading={updateAccount.isLoading} size='xs' onClick={() => onSave()}>保存</Button>}
    >
      <Flex direction='column' align='center'>
        <UserAvatar user={user} size='lg' />
        <Title order={5} mt="xs" mb="xl">{user.name}</Title>
        <FormSection>
          <FormSection.TextInput label="姓名" {...profileForm.getInputProps('name')} />
        </FormSection>

      </Flex>
    </UserSettingsContainer>

  )
}
