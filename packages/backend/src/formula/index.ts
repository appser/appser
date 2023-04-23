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

  parse(data: unknown): any {
    if (Array.isArray(data)) {
      return data.map(item => this.parse(item))
    } else if (typeof data === 'object' && data !== null) {
      return Object.entries(data).reduce((acc, [key, value]) => {
        acc[key] = this.parse(value)

        return acc
      }, {} as any)
    } else if (typeof data === 'string') {
      if (this.isValidExpression(data)) {
        const expression = data.slice(1)
        const ret = this.parser.parse(expression)

        if (ret.error) throw formulaError('invalidExpression', { parserError: ret.error })

        return ret.result
      } else {
        return data
      }
    } else {
      return data
    }
  }
}

export default new Formula()
