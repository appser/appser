import { join } from 'node:path'

import { generate } from 'openapi-typescript-codegen'
import rimraf from 'rimraf'

import { server } from '../packages/backend/src'

import type { OpenAPIV3 } from 'openapi-types'

const input = server.openAPI
const output = join(__dirname, '../packages/appser-js/src/generated')

validateOperation(input)

rimraf.sync(output)

generate({
  input,
  output,
  clientName: 'Generated',
  indent: '2',
  useOptions: true
})

console.log(`Appser JS client generated at ${output}.`)

function validateOperation(doc: OpenAPIV3.Document) {
  const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']
  const operationIds: string[] = []

  Object.keys(doc.paths).forEach(path => {
    const item = doc.paths[path]

    item &&
      Object.keys(item).forEach(method => {
        if (methods.includes(method)) {
          const operation = item[method as never] as OpenAPIV3.OperationObject

          if (!operation.operationId) {
            throw new Error(`operationId is missing for ${method} ${path}`)
          }

          if (!operation.tags || !operation.tags.length) {
            throw new Error(`tag is missing for ${method} ${path}`)
          }

          if (operationIds.includes(operation.operationId)) {
            throw new Error(`operationId ${operation.operationId} is duplicated`)
          }

          operationIds.push(operation.operationId)
        }
      })
  })
}
