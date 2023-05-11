import { Popover } from '@appser/ui'
import { useDisclosure } from '@appser/ui/hooks'
import { useEffect } from 'react'
import { ActionButton } from 'web/components/common/ActionButton'
import { IconPlus } from 'web/components/icons/IconPlus'
import { useAddField } from 'web/hooks/dataset/useAddField'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'

import { FieldConfigForm } from './FieldConfigForm'

import type { FC } from 'react'
import type { DatasetField } from 'web/types'

export const FieldAddButton: FC = () => {
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()
  const { mutate, isLoading } = useAddField(dataset?.id)
  const [opened, { toggle }] = useDisclosure(false)

  const onSubmit = (field: DatasetField) => {
    if (!view) return new Error('No view selected')

    mutate(
      {
        title: field.title,
        type: field.type,
        options: field.options
      },
      {
        onSuccess(data, variables, context) {
          toggle()
        }
      }
    )
  }

  const freshField: DatasetField = {
    title: '',
    name: '',
    type: 'simpleText'
  }

  useEffect(() => {
    const rightElementWrap = document.getElementsByClassName('dvn-scroll-inner')?.[0].children?.[1] as HTMLDivElement

    if (rightElementWrap) {
      rightElementWrap.style.height = '37px'
      rightElementWrap.style.flex = '0 0 100px'
    }
  }, [])

  return (
    <Popover
      withinPortal
      opened={opened}
      onChange={toggle}
      width={300}
      position="bottom-start"
      transitionProps={{
        duration: 0
      }}
      trapFocus
    >
      <Popover.Target>
        <ActionButton
          sx={{
            borderRadius: 0,
            height: 37
          }}
          ml='lg'
          style={{ width: 100 }}
          onClick={() => {
            document.body.dispatchEvent(new MouseEvent('mousedown', {
              view: window,
              bubbles: true,
              cancelable: true
            }))
            toggle()
          }}
        >
          <IconPlus />
        </ActionButton>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <FieldConfigForm
          loading={isLoading}
          defaultField={freshField}
          onCancel={toggle}
          onSubmit={onSubmit}
        />
      </Popover.Dropdown>
    </Popover>
  )
}
