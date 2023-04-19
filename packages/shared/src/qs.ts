import qs from 'qs'

function parse(str: string) {
  return qs.parse(str, {
    allowDots: true,
    comma: true
  })
}

function stringify(obj: unknown) {
  return qs.stringify(obj, {
    allowDots: true,
    arrayFormat: 'comma',
    encode: false
  })
}

export default {
  parse,
  stringify
}
