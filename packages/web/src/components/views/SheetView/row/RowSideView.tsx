import { Box, Title } from '@appser/ui'

import { FieldFormInput } from '../field/FieldFormInput'

import type { Row } from './Row'
import type { SheetField } from '../field/Field'
import type { FC } from 'react'

interface Props {
  fields: SheetField[]
  row: Row
}

export const RowSideView: FC<Props> = ({ row, fields }) => {
  return (
    <Box p="md">
      <Title order={6}>Side View</Title>
      {fields.map(field => (
        <FieldFormInput
          key={field.name}
          field={field}
          defaultData={row.record[field.name]}
          mb='xs'
        />
      ))}
    </Box>
  )
}
