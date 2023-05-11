import { Button, Flex, Group, colors } from '@appser/ui'
import { openContextModal } from '@appser/ui/modals'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAddRecord } from 'web/hooks/dataset/useAddRecord'
import i18n from 'web/vendor/i18n'

import { FieldFormInput } from '../views/SheetView/field/FieldFormInput'

import type { SheetField } from '../views/SheetView/field/Field'
import type { ContextModalProps } from '@appser/ui/modals'

type CreateRecordProps = {
  datasetId: string
  viewId: string
  fields: SheetField[]
}

export function CreateRecordModal({ context, id, innerProps: { fields, viewId, datasetId } }: ContextModalProps<CreateRecordProps>) {
  const { t } = useTranslation()
  const { mutate, isLoading } = useAddRecord(datasetId, viewId)
  const [data, setData] = useState<Record<string, unknown>>({})

  const onCreate = () => {
    mutate(data, {
      onSuccess() {
        context.closeModal(id)
      }
    })
  }

  return (
    <Flex direction="column" w='100%' sx={{ flex: 1 }}>
      <Flex sx={{ flex: 1, overflow: 'auto' }} pl='lg' pr='lg' pb={30} direction='column'>
        {fields.map(field => (
          <FieldFormInput
            key={field.name}
            field={field}
            onChange={v => setData(prev => ({ ...prev, [field.name]: v }))}
          // onChange={v => console.log(v)}
            mb='xs'
          />
        ))}
      </Flex>

      <Group
        position='right'
        pt='sm'
        sx={theme => ({
          borderTop: `1px solid ${colors[theme.colorScheme].border}`,
          position: 'absolute',
          width: '100%',
          bottom: 0,
          zIndex: 99,
          background: theme.colorScheme === 'light' ? 'white' : theme.colors.dark[7]
        })}
        pb='sm'
        pr='lg'
      >
        <Button variant='default' size='xs' onClick={() => context.closeModal(id)}>
          {t('modal.button.cancel')}
        </Button>
        <Button loading={isLoading} size="xs" onClick={onCreate}>
          Submit
        </Button>
      </Group>
    </Flex>
  )
}

export const openCreateRecord = (p: CreateRecordProps) => {
  const t = i18n.getFixedT(i18n.language)

  return openContextModal({
    modal: 'CreateRecordModal',
    title: 'New Record',
    withCloseButton: false,
    centered: false,
    size: 650,
    styles: () => ({
      content: {
        overflow: 'hidden !important'
      },
      body: {
        width: `calc(100%)`,
        paddingLeft: 0,
        paddingRight: 0
      }
    }),
    innerProps: p
  })
}
