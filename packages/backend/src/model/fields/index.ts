import account from './account'
// import attachment from './fields/attachment'
import checkbox from './checkbox'
import custom from './custom'
import date from './date'
import email from './email'
import multipleSelect from './multipleSelect'
import number from './number'
import numId from './numId'
// import relation from './fields/relation'
import richText from './richText'
import simpleText from './simpleText'
import singleSelect from './singleSelect'
import url from './url'

const publicField = { checkbox, date, email, multipleSelect, number, numId, richText, simpleText, singleSelect, url }
const privateField = { account, custom }
export const fields = { ...publicField, ...privateField } as const

type FieldsTuple = [keyof typeof fields, ...(keyof typeof fields)[]]

export const publicFieldTypes = Object.keys(publicField) as FieldsTuple
