import { Box, Button, Group } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { openContextModal } from '@mantine/modals'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAddAppPeople } from 'web/servers/app/useAddAppPeople'
import { useAppPeople } from 'web/servers/app/useAppPeople'
import { useListAppRole } from 'web/servers/app/useListAppRole'
import { useListOrgPeople } from 'web/servers/org/useListOrgPeople'
import i18n from 'web/vendor/i18n'

import { FormSection } from '../common/FormSection'
import { IconSelector } from '../icons/IconSelector'
import { OrgUserSelect } from '../org/OrgUserSelect'
import { RoleSelect } from '../role/RoleSelect'

import type { ContextModalProps } from '@mantine/modals'
import type { TApp } from 'web/servers/app/types'

export type AddAppMemberModalProps = {
  app: Pick<TApp, 'orgId' | 'name' | 'id'>
}

export function AddAppMemberModal({ context, id, innerProps: { app } }: ContextModalProps<AddAppMemberModalProps>) {
  const { t } = useTranslation()
  const addAppPeople = useAddAppPeople()
  const { data: orgPersons = [] } = useListOrgPeople({ orgId: app.orgId, kind: 'member' })
  const { data: datasetPersons = [] } = useAppPeople(app.id)
  const { data: datasetRoles = [] } = useListAppRole(app.id)
  const userData = useMemo(() => orgPersons.map(({ user }) => ({
    label: user.name,
    value: user.id,
    avatar: user.avatar,
    disabled: datasetPersons.some(({ user: { id } }) => id === user.id)
  })), [orgPersons, datasetPersons])

  const form = useForm({
    initialValues: {
      userId: '',
      roleId: ''
    },
    validate: {
      userId: isNotEmpty(),
      roleId: isNotEmpty()
    }
  })

  const onSubmit = () => {
    addAppPeople.mutate(
      {
        appId: app.id,
        requestBody: form.values
      },
      {
        onSuccess() {
          context.closeModal(id)
        }
      }
    )
  }

  // TODO @tccsg
  return (
    <Box>
      <OrgUserSelect
        data={userData}
        mb='md'
        maxSelectedValues={1}
        rightSection={<IconSelector size={16} />}
        rightSectionWidth={48}
        styles={theme => ({
          input: {
            backgroundColor: theme.colorScheme === 'dark' ? undefined : theme.colors.gray[0],
            borderColor: theme.colorScheme === 'dark' ? undefined : theme.colors.gray[3],
            paddingTop: 5,
            paddingBottom: 5
          }
        })}
        onChange={users => form.setFieldValue('userId', users[0])}
      />
      <FormSection mb="lg">
        <FormSection.Item label="Role">
          <RoleSelect
            roles={datasetRoles}
            onChange={role => form.setFieldValue('roleId', role.id)}
          />
        </FormSection.Item>
      </FormSection>
      <Group position='right'>
        <Button variant='default' onClick={() => context.closeModal(id)}>
          {t('modal.button.cancel')}
        </Button>
        <Button loading={addAppPeople.isLoading} disabled={!form.isValid()} onClick={onSubmit}>
          Submit
        </Button>
      </Group>
    </Box>
  )
}

export const openAddAppMember = ({ app }: AddAppMemberModalProps) => {
  const t = i18n.getFixedT(i18n.language)

  return openContextModal({
    modal: 'AddAppMemberModal',
    withCloseButton: false,
    title: t('modal.datasetAddMember.title', { name: app.name }),
    trapFocus: false,
    innerProps: {
      app
    }
  })
}
