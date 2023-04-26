import { Popover } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useEffect } from 'react'
import { ActionButton } from 'web/components/common/ActionButton'
import { IconPlus } from 'web/components/icons/IconPlus'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'
import { useAddColumn } from 'web/servers/dataset/useAddColumn'

import { ColumnConfigForm } from './ColumnConfigForm'

import type { DatasetColumn } from './Column'
import type { FC } from 'react'

export const ColumnAddButton: FC = () => {
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()
  const { mutate, isLoading } = useAddColumn(dataset?.id)
  const [opened, { toggle }] = useDisclosure(false)

  const onSubmit = (column: DatasetColumn) => {
    if (!view) return new Error('No view selected')

    mutate(
      {
        title: column.title,
        field: column.field,
        options: 'options' in column ? column.options : undefined
      },
      {
        onSuccess(data, variables, context) {
          toggle()
        }
      }
    )
  }

  const freshColumn: DatasetColumn = {
    title: '',
    name: '',
    field: 'simpleText'
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
        <ColumnConfigForm
          loading={isLoading}
          column={freshColumn}
          onCancel={toggle}
          onSubmit={onSubmit}
        />
      </Popover.Dropdown>
    </Popover>
  )
}
