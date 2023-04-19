import globToRegExp from 'glob-to-regexp'

export function filter(str: string | string[], pattern: string | string[]) {
  const list = Array.isArray(str) ? str : [str]

  return list.filter((str) => isMatchString(str, pattern))
}

export function isMatchString(str: string, pattern: string | string[]) {
  const patterns = Array.isArray(pattern) ? pattern : [pattern]

  return patterns.some((pattern) => {
    const regex = globToRegExp(pattern, { extended: true, globstar: true })

    return regex.test(str)
  })
}

export function isMatchObject(obj: Record<string, string>, pattern: Record<string, string | string[]>) {
  return Object.entries(obj).every(([key, value]) => {
    if (!(key in pattern)) return false

    return isMatchString(value, pattern[key])
  })
}
