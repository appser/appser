const parse = require('json-templates')

interface Parameter {
  key: string
  defaultValue?: string
}

export default function jsonTemplate<T>(template: T, vars: Record<string, unknown> = {}): T {
  const tpl = parse(template)
  const parameters: Parameter[] = tpl.parameters
  const isAllBelongToVars = parameters.every(parameter => parameter.key in vars)

  if (isAllBelongToVars) return tpl(vars)
  else throw new TypeError(`Missing parameters: ${parameters.map(parameter => parameter.key).join(', ')}`)
}
