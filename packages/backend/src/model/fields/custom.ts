import Field from 'backend/model/field'
import { z } from 'zod'

/**
 * The custom field type is only used for the original table, not for the user-defined table.
 */
export default Field.define(
  'custom',
  {
    baseType: 'jsonb'
  },
  z.any()
)
