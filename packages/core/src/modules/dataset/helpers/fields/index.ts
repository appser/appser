// import attachment from './attachment'
import checkbox from './checkbox'
import date from './date'
import email from './email'
import multipleSelect from './multipleSelect'
import number from './number'
// import relation from './relation'
// import richText from './richText'
import numId from './numId'
import simpleText from './simpleText'
import singleSelect from './singleSelect'
import url from './url'

export const fields = { checkbox, date, email, multipleSelect, numId, number, simpleText, singleSelect, url }

type FieldsTuple = [keyof typeof fields, ...(keyof typeof fields)[]]

export const fieldTypes = Object.keys(fields) as FieldsTuple
