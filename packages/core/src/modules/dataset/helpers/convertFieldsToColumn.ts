import { column } from 'core/model/column'

import { Field } from './field'

import type { Column } from 'core/model/column'
import type { Path } from 'core/model/path'
import type { TDataset } from 'core/models/dataset'
import type { Schema } from 'zod'

export function convertFieldsToColumn(field: TDataset['fields']): Column {
  const schema = Object.entries(field).reduce((acc, [name, config]) => {
    acc[name] = new Field(name, config).schema

    return acc
  }, {} as Record<string, Schema | Path>)

  return column('jsonb', schema)
}
