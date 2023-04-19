import { ActionIcon, Box, Button, Flex, Group, Popover, Select, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconTrash } from '@tabler/icons'
import { MenuButton } from 'web/components/common/MenuButton'
import { useRecordsFilters } from 'web/servers/dataset/useQueryRecord'

import { ColumnFilter } from '../column/ColumnFilter'
import { useColumns } from '../hooks/useColumns'

import type { FC } from 'react'

export const RecordFilterButton: FC = () => {
  const [filters, setFilters] = useRecordsFilters()
  const { visibleColumns } = useColumns()

  const form = useForm({
    initialValues: {
      filters
    }
  })

  const addFilter = () => {
    form.insertListItem('filters', { [visibleColumns[0].name]: {} })
  }

  const onSubmit = () => {
    console.log(form.values.filters) // => [{ name: {gt:'xx'} }, { age: {lt:'xx'} }]
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
            {form.values.filters.map((filter, index) => (
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
                      defaultValue='or'
                    />
                    )}
                <ColumnFilter
                  filter={filter}
                  onChange={(v) => {
                    // form.values.filters[index] = v
                    form.setFieldValue(`filters.${index}`, v)
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
            <Button variant='subtle' onClick={addFilter}>add</Button>
            <Button variant='subtle' onClick={onSubmit}>Filter</Button>
          </Group>
        </Flex>
      </Popover.Dropdown>
    </Popover>
  )
}
