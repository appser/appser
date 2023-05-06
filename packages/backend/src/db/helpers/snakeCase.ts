export function snakeCase(str: string) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}
