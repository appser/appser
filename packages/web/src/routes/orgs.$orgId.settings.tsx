import { Box, Button, Divider, Flex, Group, Modal, Text, TextInput, Title } from '@appser/ui'
import { hasLength, useForm } from '@appser/ui/form'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { FormSection } from 'web/components/common/FormSection'
import { NavHeader } from 'web/components/common/NavHeader'
import { useDeleteOrg } from 'web/hooks/org/useDeleteOrg'
import { useGetOrg } from 'web/hooks/org/useGetOrg'
import { useUpdateOrg } from 'web/hooks/org/useUpdateOrg'

export default function OrgIdSettings() {
  const { t } = useTranslation()
  const { orgId = '' } = useParams<{ orgId: string }>()
  const { data: org, isSuccess } = useGetOrg(orgId)
  const updateOrg = useUpdateOrg()
  const deleteOrg = useDeleteOrg()
  const [showDeleteOrgModal, setShowDeleteOrgModal] = useState(false)
  const name = org?.name

  const generalForm = useForm({
    initialValues: {
      name: ''
    },
    validate: {
      name: hasLength({ min: 1, max: 50 }, t('page.home.orgs.-.settings.orgNameError'))
    }
  })

  const dangerZoneForm = useForm({
    initialValues: {
      name: ''
    }
  })

  const onSubmit = (values: typeof generalForm.values) => {
    if (!org) return

    updateOrg.mutate({
      orgId: org.id,
      requestBody: values
    })
  }

  useEffect(() => {
    generalForm.setValues({
      name: org?.name
    })
  }, [org])

  if (!isSuccess) return null

  return (
    <Flex direction="column" sx={{ flex: 1 }}>
      <NavHeader px='lg'>
        <Title order={5} pl='sm'>{t('page.home.orgs.-.settings.settings')}</Title>
      </NavHeader>
      <Flex direction="column" p="lg" w={640}>
        <FormSection title={t('page.home.orgs.-.settings.general')} mb="xl">
          <form onSubmit={generalForm.onSubmit(onSubmit)}>
            <FormSection.TextInput label={t('page.home.orgs.-.settings.orgName')} {...generalForm.getInputProps('name')} />
            <FormSection.Divider />
            <Group position="right" py='xs'>
              <Button
                disabled={!generalForm.values.name || generalForm.values.name === org.name}
                loading={updateOrg.isLoading}
                type="submit"
                size='xs'
              >
                {t('modal.button.save')}
              </Button>
            </Group>
          </form>
        </FormSection>

        <FormSection title={t('page.home.orgs.-.settings.dangerZone')} py={5}>
          <FormSection.Item
            label={t('page.home.orgs.-.settings.deleteOrg')}
            description={t('page.home.orgs.-.settings.deleteOrgDescription')}
          >
            <Button size='xs' onClick={() => setShowDeleteOrgModal(true)}>
              {t('page.home.orgs.-.settings.deleteOrg')}
            </Button>
          </FormSection.Item>
        </FormSection>

        <Modal
          opened={showDeleteOrgModal}
          onClose={() => setShowDeleteOrgModal(false)}
          title={t('modal.confirmDeleteOrg.title')}
        >
          <Box>
            <Text size="sm" mb="sm">
              <Trans i18nKey="modal.confirmDeleteOrg.alert" values={{ name }} />
            </Text>
            <TextInput size='sm' {...dangerZoneForm.getInputProps('name')} label={t('modal.confirmDeleteOrg.inputLabel')} />
            <Divider my="lg" />
            <Button
              fullWidth
              disabled={dangerZoneForm.values.name !== name}
              loading={deleteOrg.isLoading}
              onClick={() => deleteOrg.mutate({ orgId: org.id })}
            >
              {t('modal.confirmDeleteOrg.delete')}
            </Button>
          </Box>
        </Modal>
      </Flex>
    </Flex>
  )
}
