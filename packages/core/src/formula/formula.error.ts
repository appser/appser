import { createErrors, t } from 'core/error'

/**
 * hot-formula-parser error code
 *
 * ERROR,
 * ERROR_DIV_ZERO,
 * ERROR_NAME,
 * ERROR_NOT_AVAILABLE,
 * ERROR_NULL,
 * ERROR_NUM,
 * ERROR_REF,
 * ERROR_VALUE
 */

export const formulaError = createErrors('formula', {
  invalidExpression: ['Forbidden', t('formula.invalidExpression')]
})
