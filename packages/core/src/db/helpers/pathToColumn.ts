import db from '..'

export function pathToColumn(path: string) {
  const parts = path.split('.')

  const { sql, bindings } = parts.reduce((acc, part, index) => {
    if (index === 0) {
      acc.sql.push('??')
      acc.bindings.push(part)
    } else if (index === parts.length - 1) {
      acc.sql.push('->> ?')
      acc.bindings.push(part)
    } else {
      acc.sql.push('-> ?')
      acc.bindings.push(part)
    }

    return acc
  }, {
    sql: [] as string[],
    bindings: [] as string[]
  })

  return db.raw(sql.join(' '), bindings)
}
