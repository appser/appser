import { Box, Title } from '@appser/ui'
import { useUpdateRecord } from 'web/hooks/dataset/useUpdateRecord'

import { FieldFormInput } from '../field/FieldFormInput'

import type { Row } from './Row'
import type { Field } from '../field/Field'
import type { FC } from 'react'

interface Props {
  row: Row
  fields: Field[]
}

export const RowSideView: FC<Props> = ({ row, fields }) => {
  const updateRecord = useUpdateRecord()

  return (
    <Box p="md">
      <Title order={6}>Side View</Title>

      {fields.map(field => (
        <FieldFormInput
          key={field.name}
          field={field}
          defaultValue={row.record[field.name]}
          onDone={v => updateRecord.mutate({
            id: row.record.id,
            fields: {
              [field.name]: v
            },
            optimisticUpdateRow: row
          })}
        />
      ))}
    </Box>
  )
}
