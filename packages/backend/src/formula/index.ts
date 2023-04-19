import { formulaError } from './formula.error'
import { Parser } from './parser'

import type { Config } from './config'

export class Formula {
  private parser

  constructor(config?: Config) {
    this.parser = new Parser(config)
  }

  isValidExpression(tpl: string) {
    return typeof tpl === 'string' && tpl.startsWith('=') && tpl.length > 1
  }

  parse(obj: unknown): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.parse(item))
    } else if (typeof obj === 'object' && obj !== null) {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key] = this.parse(value)

        return acc
      }, {} as any)
    } else if (typeof obj === 'string') {
      if (this.isValidExpression(obj)) {
        const expression = obj.slice(1)
        const data = this.parser.parse(expression)

        if (data.error) throw formulaError('invalidExpression', { parserError: data.error })

        return data.result
      } else {
        return obj
      }
    } else {
      return obj
    }
  }
}

export default new Formula()
