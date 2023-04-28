import { ActionIcon, Box, Button, Flex, Group, Popover, Select, Text } from '@appser/ui'
import { useForm } from '@appser/ui'
import { IconTrash } from '@tabler/icons'
import { MenuButton } from 'web/components/common/MenuButton'
import { useCurrentRecordFilter } from 'web/servers/dataset/useQueryRecord'

import { ColumnFilter } from '../column/ColumnFilter'
import { useColumns } from '../hooks/useColumns'

import type { FC } from 'react'
import type { FilterContext } from 'web/servers/dataset/useQueryRecord'

export const ToolbarFilterButton: FC = () => {
  const [filter, setFilter] = useCurrentRecordFilter()
  const { visibleColumns } = useColumns()

  const form = useForm<FilterContext>({
    initialValues: {
      logic: filter?.logic ?? 'and',
      items: filter?.items ?? []
    }
  })

  const addFilterItem = () => {
    form.insertListItem('items', { [visibleColumns[0].name]: {} })
  }

  const onSubmit = () => {
    console.log(form.values)
  }

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
          <Box>
            {form.values.items.map((item, index) => (
              <Group key={index} spacing={0} mb='sm'>
                {!index
                  ? <Text w={70} mr='md' align='center'>where</Text>
                  : (
                    <Select
                      styles={{
                        input: {
                          borderRadius: 0
                        }
                      }}
                      w={70}
                      mr='md'
                      data={['or', 'and']}
                      defaultValue={form.values?.logic}
                    />
                    )}
                <ColumnFilter
                  condition={item}
                  onChange={(v) => {
                    // form.values.filters[index] = v
                    form.setFieldValue(`items.${index}`, v)
                  }}
                />
                <ActionIcon
                  size={36}
                  sx={{ borderRadius: 0, borderLeft: '0 none', position: 'relative', left: -2 }}
                  variant='outline'
                  onClick={() => form.removeListItem('filters', index)}
                >
                  <IconTrash size={20} />
                </ActionIcon>
              </Group>

            ))}
          </Box>
          <Group>
            <Button variant='subtle' onClick={addFilterItem}>add</Button>
            <Button variant='subtle' onClick={onSubmit}>Filter</Button>
          </Group>
        </Flex>
      </Popover.Dropdown>
    </Popover>
  )
}
