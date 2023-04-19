import fs from 'node:fs'
import path from 'node:path'

import { core } from '../packages/backend/src'

const uri = path.join(__dirname, '../packages/api-docs/admin.openapi.json')

fs.writeFileSync(uri, JSON.stringify(core.openAPI, null, 2))

console.log(`generated successfully at ${uri}.`)
