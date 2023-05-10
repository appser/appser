import { Button, Card, Group, hasLength, useForm } from '@appser/ui'
import { FormSection } from 'web/components/common/FormSection'

import { FieldTypeSelect } from './FieldTypeSelect'
import { useFieldsConfig } from '../fields'

import type { FC } from 'react'
import type { DatasetField } from 'web/types'

interface Props {
  defaultField: DatasetField
  onSubmit: (field: DatasetField) => void
  loading?: boolean
  onCancel?: () => void
}

export const FieldConfigForm: FC<Props> = ({ defaultField, loading, onSubmit, onCancel }) => {
  const fields = useFieldsConfig()
  const form = useForm<DatasetField>({
    initialValues: defaultField,
    validate: {
      title: hasLength({ min: 1, max: 50 }, 'Title must be 1-50 characters long')
    }
  })
  const OptionEditor = fields[form.values.type]?.OptionEditor

  return (
    <Card sx={{ overflow: 'visible' }} py={0}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Card.Section py="sm" px="md">
          <FormSection>
            <FormSection.TextInput
              label='Title'
              placeholder='Enter a field title'
              {...form.getInputProps('title')}
            />
            <FormSection.Divider />
            <FormSection.Item label='Field Type'>
              <FieldTypeSelect defaultType={form.values.type} onChange={f => form.setFieldValue('type', f)} />
            </FormSection.Item>
          </FormSection>
          {OptionEditor && <OptionEditor field={defaultField} onChange={v => form.setFieldValue('options', v)} />}
        </Card.Section>
        <Group my="sm" position='right'>
          <Button size='xs' variant='default' onClick={onCancel}>Cancel</Button>
          <Button size='xs' loading={loading} type='submit'>Submit</Button>
        </Group>
      </form>
    </Card>
  )
}
