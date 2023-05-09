import { Button, Flex, Group, Text, TextInput, Title } from '@appser/ui'
import { hasLength, useForm } from '@appser/ui'
import { useTranslation } from 'react-i18next'
import { useCreateOrg } from 'web/servers/account/useCreateOrg'

export default function OrgCreate() {
  const { t } = useTranslation()
  const createOrg = useCreateOrg()

  const form = useForm({
    initialValues: {
      name: ''
    },
    validate: {
      name: hasLength({ min: 2 }, t('page.org.create.invalidName'))
    }
  })

  const onSubmit = (values: typeof form.values) => {
    createOrg.mutate(values.name)
  }

  return (
    <Flex direction="column" w="100%" p='xl'>
      <Title order={3} mb='5px'>{t('page.org.create.title')}</Title>
      <Text size='sm' mb='lg' c="gray">{t('page.org.create.subTitle')}</Text>

      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput label={t('page.org.create.name')} {...form.getInputProps('name')} mb='lg' />
        <Group position='right'>
          <Button w={120} loading={createOrg.isLoading} type="submit">
            {t('page.org.create.create')}
          </Button>
        </Group>
      </form>
    </Flex>
  )
}
