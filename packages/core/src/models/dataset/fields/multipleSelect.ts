import { DatasetField } from 'core/models/dataset/helpers/datasetField'
import { z } from 'zod'

import { optionSchema } from './singleSelect'

export default DatasetField.define('multipleSelect', {
  optionSchema,

  schema:
    opts => z.string().refine(d => opts.items.find(item => item.id === d) !== undefined, {
      message: 'Invalid option selected'
    }).array()
})
