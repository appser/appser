import { Box, Title } from '@mantine/core'

import { ColumnInput } from '../column/ColumnInput'

import type { Row } from './Row'
import type { Column } from '../column/Column'
import type { FC } from 'react'

interface Props {
  columns: Column[]
  row: Row
}

export const RowSideView: FC<Props> = ({ row, columns }) => {
  return (
    <Box p="md">
      <Title order={6}>Side View</Title>
      {columns.map(column => (
        <ColumnInput
          key={column.name}
          column={column}
          data={row.record[column.name]}
          // onChange={v => setData(prev => ({ ...prev, [column.name]: v }))}
        // onChange={v => console.log(v)}
          mb='xs'
        />
      ))}
    </Box>
  )
}
