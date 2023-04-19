/**
 * All excel formulas defined in https://github.com/handsontable/formula.js/tree/develop/lib
 */

import dayjs from 'backend/vendors/dayjs'

import type { Config } from './config'
import type { ManipulateType } from 'dayjs'

const { Parser: FormulaParser } = require('hot-formula-parser')

export declare interface Parser {
  parse(expression: string): { error: null | string; result: any }
}

export class Parser extends FormulaParser {
  private config

  constructor(config?: Config) {
    super()
    this.config = config
    this.useDateTimeFunctions()
  }

  /**
   * Override and extend date-time functions.
   **/
  private useDateTimeFunctions() {
    this.setFunction('TODAY', () => {
      return dayjs().tz(this.config?.tz).startOf('d').toDate()
    })

    this.setFunction('DATE_ADD', ([date, val, unit]: [Date, number, ManipulateType]) => {
      return dayjs(date).tz(this.config?.tz).add(val, unit).toDate()
    })

    this.setFunction('DATE_START_OF', ([date, unit]: [Date, ManipulateType]) => {
      return dayjs(date).startOf(unit).toDate()
    })
  }
}
