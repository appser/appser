import { DatasetField } from 'core/models/dataset/helpers/datasetField'
import { z } from 'zod'

export default DatasetField.define('email', {
  schema: z.string().email()
})
