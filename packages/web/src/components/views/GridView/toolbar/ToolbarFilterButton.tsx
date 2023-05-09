import { ActionIcon, Box, Button, Flex, Group, Popover, Select, Text } from '@appser/ui'
import { useForm } from '@appser/ui'
import { IconTrash } from '@tabler/icons'
import { MenuButton } from 'web/components/common/MenuButton'
import { useCurrentRecordFilter } from 'web/servers/dataset/useQueryRecord'

import { ColumnFilterCondition } from '../column/ColumnFilterCondition'
import { useColumns } from '../hooks/useColumns'

import type { FC } from 'react'
import type { FilterContext } from 'web/servers/dataset/useQueryRecord'

export const ToolbarFilterButton: FC = () => {
  const [filter, setFilter] = useCurrentRecordFilter()
  const { visibleColumns } = useColumns()

  const form = useForm<FilterContext>({
    initialValues: {
      logic: filter?.logic ?? 'and',
      conditions: filter?.conditions ?? []
    }
  })

  const onSubmit = () => {
    console.log(form.values)
    setFilter(form.values)
  }

  const logicData = [
    { label: '所有', value: 'and' },
    { label: '任意', value: 'or' }
  ] as const

  return (
    <Popover
      shadow="md"
      position='bottom-start'
      // width={500}
      transitionProps={{
        duration: 0
      }}
    >
      <Popover.Target>
        <MenuButton>Filter</MenuButton>
      </Popover.Target>

      <Popover.Dropdown>
        <Flex direction="column">
          <Group>
            <Text>满足以下</Text>
            <Select
              w={100}
              data={logicData}
              defaultValue="and"
              onChange={v => v && form.setFieldValue('logic', v as any)}
            />
            <Text>条件</Text>
          </Group>
          <Box>
            {form.values.conditions.map((condition, index) => (
              <Group key={`${Object.keys(condition)[0]}${index}`} spacing={0} mb='sm'>
                <ColumnFilterCondition
                  condition={condition}
                  onChange={(v) => form.setFieldValue(`conditions.${index}`, v)}
                />
                <ActionIcon
                  size={36}
                  variant='outline'
                  onClick={() => form.removeListItem('conditions', index)}
                >
                  <IconTrash size={20} />
                </ActionIcon>
              </Group>
            ))}
          </Box>
          <Group>
            <Button
              variant='subtle'
              onClick={() => form.insertListItem('conditions', { [visibleColumns[0].name]: {} })}
            >
              add
            </Button>
            <Button variant='subtle' onClick={onSubmit}>Filter</Button>
          </Group>
        </Flex>
      </Popover.Dropdown>
    </Popover>
  )
}
