import config from 'core/config'

const bcrypt = require('bcryptjs')

export function hashSync(password: string): string {
  return bcrypt.hashSync(password, config.vendors.bcrypt.seedLength)
}

export function compareSync(str: string, hash: string): boolean {
  return bcrypt.compareSync(str, hash)
}
