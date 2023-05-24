import { DatasetField } from 'core/models/dataset/helpers/datasetField'
import { z } from 'zod'

export default DatasetField.define('simpleText', {
  schema: z.string().max(2000)
})
