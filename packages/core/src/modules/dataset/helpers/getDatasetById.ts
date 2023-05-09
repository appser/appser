import { Dataset } from 'core/models/dataset'

import { datasetError } from '../dataset.error'

export async function getDatasetById(id: string) {
  const dataset = await Dataset.query.where({ id }).first()

  if (!dataset) throw datasetError('notFound')

  return dataset
}
