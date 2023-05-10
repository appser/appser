import { Box, Button, Group, openContextModal, useClipboard, useForm } from '@appser/ui'
import { useTranslation } from 'react-i18next'
import { useCreateOrgInvitation } from 'web/hooks/org/useCreateOrgInvitation'
import { useListOrgRole } from 'web/hooks/org/useListOrgRole'
import { useActivatedOrg } from 'web/hooks/useActivatedOrg'
import i18n from 'web/vendor/i18n'

import { FormSection } from '../common/FormSection'
import { RoleSelect } from '../role/RoleSelect'

import type { ContextModalProps } from '@appser/ui'

export function InviteOrgPeopleModal({ context, id, innerProps }: ContextModalProps) {
  const { t } = useTranslation()
  const [{ id: orgId = '' }] = useActivatedOrg()
  const { data: orgRoles = [] } = useListOrgRole({ orgId })
  const createOrgInvitation = useCreateOrgInvitation()
  const clipboard = useClipboard()

  const form = useForm({
    initialValues: {
      roleId: ''
    }
  })

  const onCreateInvitation = () => {
    createOrgInvitation.mutate({
      orgId,
      requestBody: {
        roleId: form.values.roleId
      }
    }, {
      onSuccess: (data) => {
        const link = `${location.origin}/invite?it=${data.invitationToken}`
        clipboard.copy(link)
      }
    })
  }

  return (
    <Box>
      <FormSection mb="md">
        <FormSection.Select
          label={t('modal.invitePeopleToOrg.inviteBy')}
          w={80}
          defaultValue="link"
          data={[{ value: 'link', label: String(t('modal.invitePeopleToOrg.link')) }]}
        />
      </FormSection>
      <FormSection mb="lg">
        <FormSection.Item
          label={t('modal.invitePeopleToOrg.grantRole')}
        >
          <RoleSelect
            roles={orgRoles}
            defaultRoleId={form.values.roleId}
            onChange={role => form.setValues({ roleId: role.id })}
          />
        </FormSection.Item>
      </FormSection>
      <Group position='right'>
        <Button variant='default' onClick={() => context.closeModal(id)}>
          {t('modal.button.cancel')}
        </Button>
        <Button
          disabled={!form.values.roleId}
          loading={createOrgInvitation.isLoading}
          color={clipboard.copied ? 'green' : 'appser'}
          onClick={onCreateInvitation}
        >
          {clipboard.copied ? t('modal.invitePeopleToOrg.copiedUrl') : t('modal.invitePeopleToOrg.copyLink')}
        </Button>
      </Group>
    </Box>
  )
}

export const openInviteOrgPeople = () => {
  const t = i18n.getFixedT(i18n.language)

  return openContextModal({
    modal: 'InviteOrgPeopleModal',
    withCloseButton: false,
    trapFocus: false,
    title: t('modal.invitePeopleToOrg.title'),
    innerProps: {
    }
  })
}
