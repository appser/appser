import type { TDataset } from 'backend/models/dataset'

export const datasetDefaultColumn: TDataset['column'] = {
  id: { field: 'numId', options: { dynamicDefault: 'snowflakeId' }, isRequired: true, isLocked: true },
  name: { field: 'simpleText' },
  creator: { field: 'numId', isRequired: true },
  lastEditor: { field: 'numId', isRequired: true },
  createdAt: { field: 'date', options: { dynamicDefault: 'now' }, isRequired: true },
  updatedAt: { field: 'date', options: { dynamicDefault: 'now' }, isRequired: true }
  /* other random key name, auto generate by nanoid */
}
