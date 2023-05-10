import { Field } from 'core/modules/dataset/helpers/field/field'
import { z } from 'zod'

import { optionSchema } from './singleSelect'

export default Field.define('multipleSelect', {
  optionSchema,

  schema:
    opts => z.string().refine(d => opts.items.find(item => item.id === d) !== undefined, {
      message: 'Invalid option selected'
    }).array()
})
