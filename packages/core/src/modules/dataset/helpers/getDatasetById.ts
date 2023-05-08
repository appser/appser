import { Dataset } from 'core/models/dataset'

import { datasetError } from '../dataset.error'

export async function getDatasetById(id: string) {
  const set = await Dataset.query.where({ id }).first()

  if (!set) throw datasetError('notFound')

  return set
}
