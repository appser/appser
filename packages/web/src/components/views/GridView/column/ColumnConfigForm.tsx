import { Button, Card, Group } from '@mantine/core'
import { hasLength, useForm } from '@mantine/form'
import { FormSection } from 'web/components/common/FormSection'

import { FieldSelect } from '../field/FieldSelect'
import { useFields } from '../fields'

import type { DatasetColumn } from './Column'
import type { FC } from 'react'

interface ColumnConfigFormProps {
  column: DatasetColumn
  onSubmit: (column: DatasetColumn) => void
  loading?: boolean
  onCancel?: () => void
}

export const ColumnConfigForm: FC<ColumnConfigFormProps> = ({
  column,
  onSubmit,
  onCancel,
  loading
}) => {
  const fields = useFields()
  const form = useForm<DatasetColumn>({
    initialValues: column,
    validate: {
      title: hasLength({ min: 1, max: 50 }, 'Title must be 1-50 characters long')
    }
  })
  const OptionEditor = fields[form.values.field]?.OptionEditor

  return (
    <Card sx={{ overflow: 'visible' }} py={0}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Card.Section py="sm" px="md">
          <FormSection>
            <FormSection.TextInput
              label='Title'
              placeholder='Enter a column title'
              {...form.getInputProps('title')}
            />
            <FormSection.Divider />
            <FormSection.Item label='Field Type'>
              <FieldSelect defaultField={form.values.field} onChange={f => form.setFieldValue('field', f)} />
            </FormSection.Item>
          </FormSection>
          {OptionEditor && <OptionEditor column={column} onChange={v => form.setFieldValue('options', v)} />}
        </Card.Section>
        <Group my="sm" position='right'>
          <Button size='xs' variant='default' onClick={onCancel}>Cancel</Button>
          <Button size='xs' loading={loading} type='submit'>Submit</Button>
        </Group>
      </form>
    </Card>
  )
}
