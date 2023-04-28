import { Accordion, Box, Flex, Group, NavLink, Navbar, Tabs, Text, Title } from '@appser/ui'
import { Prism } from '@appser/ui'
import { useEffect, useState } from 'react'

import openapiJson from '../admin.openapi.json'

import type { OpenAPIV3 } from 'openapi-types'

type Operation = OpenAPIV3.OperationObject<{ method: string; path: string }>

export function ApiDocs() {
  const finalDoc: Record<string, Operation[]> = parser()
  const [activeOperation, setActiveOperation] = useState<Operation>(Object.values(finalDoc)[0][0])
  const [innerResponses, setInnerResponses] = useState<Record<string, OpenAPIV3.ResponseObject>>({})
  const [resTabValue, setResTabValue] = useState('')
  const [innerParams, setInnerParams] = useState< Record<'query' | 'header' | 'path' | 'cookie' | 'body' | string, OpenAPIV3.RequestBodyObject | OpenAPIV3.ParameterObject[]>>({})
  const [reqTabValue, setReqTabValue] = useState('')

  useEffect(() => {
    const responses = activeOperation.responses as any
    const _res = responsesGenerator(responses)
    const _req = requestGenerator(activeOperation)

    setInnerResponses(_res)
    setInnerParams(_req)
    setResTabValue(Object.keys(_res)[0])
    setReqTabValue(Object.keys(_req)[0])
  }, [activeOperation])

  return (
    <Flex h='100%'>
      <Navbar w={220} h='100%' p='md' zIndex={99} sx={{ overflow: 'auto' }}>
        <Navbar.Section>
          {Object.keys(finalDoc).map(tag => (
            <NavLink key={tag} childrenOffset={20} label={tag} defaultOpened>
              {finalDoc[tag].map((operation: any) => (
                <NavLink onClick={() => setActiveOperation(operation)} active={operation.operationId === activeOperation.operationId} key={operation.operationId} label={operation.operationId} />
              ))}
            </NavLink>
          ))}
        </Navbar.Section>
      </Navbar>
      <Flex sx={{ flex: 1, overflow: 'auto' }} direction='column' p='lg'>
        <Title mb='lg'>{activeOperation.operationId}</Title>
        <Text>{activeOperation.description}</Text>
        <Tabs defaultValue='rest-api' mb='xl'>
          <Tabs.List>
            <Tabs.Tab value='rest-api'>Rest API</Tabs.Tab>
            <Tabs.Tab value='javascript'>Javascript</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel pt='md' value='rest-api'>
            <Group>
              <Box sx={theme => ({
                backgroundColor: theme.colors.blue[5],
                color: theme.white,
                padding: '0px 10px',
                height: 20,
                lineHeight: '20px',
                fontSize: theme.fontSizes.sm,
                borderRadius: 20
              })}
              >
                {activeOperation.method}
              </Box>
              {activeOperation.path}
            </Group>
          </Tabs.Panel>
          <Tabs.Panel pt='md' value='javascript'>
            <Prism language='javascript'>
              {`import Client from '../src/index.node'

const foo = new Client({
  endpoint: 'http://127.0.0.1:7900',
  withCredentials: true
})

foo.request.config.TOKEN = 'test'

foo.auth
  .authByEmail({
    requestBody: {
      email: 'demo@appser.run',
      password: '123456'
    }
  })
  .then(res => {
    console.log('res', res)
  })
  .catch(e => {
    console.log('e', e)
  })`}
            </Prism>
          </Tabs.Panel>
        </Tabs>

        <Box mt='xl'>
          <Title order={3}>Params</Title>
          <Tabs value={reqTabValue}>
            <Tabs.List>
              {Object.keys(innerParams).map(p => <Tabs.Tab onClick={() => setReqTabValue(p)} key={p} value={p}>{p}</Tabs.Tab>)}
            </Tabs.List>
            {Object.keys(innerParams).map(k => {
              const bodyData = k === 'body' ? (innerParams[k] as OpenAPIV3.RequestBodyObject).content['application/json'].schema as OpenAPIV3.SchemaObject : {}

              return (
                <Tabs.Panel key={k} pt='md' value={k}>
                  {k !== 'body' && (
                    <Accordion multiple chevronPosition='left'>
                      {(innerParams[k] as OpenAPIV3.ParameterObject[]).map(p => (
                        <Accordion.Item key={p.name} value={p.name}>
                          {!p.description
                            ? (

                              <Group fz={15} p='16px 36px'>
                                <Text>{p.name}</Text>
                                <Text fz={13} color='gray.6'>{(p.schema as OpenAPIV3.SchemaObject)?.type}</Text>
                                <Text>{p.required ? 'required' : ''}</Text>
                              </Group>

                              )
                            : (
                              <Accordion.Control p={0}>
                                <Group fz={15} p='16px 0px'>
                                  <Text>{p.name}</Text>
                                  <Text fz={13} color='gray.6'>{(p.schema as OpenAPIV3.SchemaObject)?.type}</Text>
                                  <Text>{p.required ? 'required' : ''}</Text>
                                </Group>
                              </Accordion.Control>
                              )}
                          <Accordion.Panel>
                            <Text>{p.description}</Text>
                          </Accordion.Panel>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  )}
                  {k === 'body' && propertyTreeGenerator(bodyData)}
                </Tabs.Panel>
              ) })}

          </Tabs>
        </Box>

        <Box mt='xl'>
          <Title order={3}>Responses</Title>
          <Tabs value={resTabValue}>
            <Tabs.List>
              {Object.keys(innerResponses).map(res => (
                <Tabs.Tab onClick={() => setResTabValue(res)} key={res} value={res}>{res}</Tabs.Tab>
              ))}
            </Tabs.List>
            {Object.keys(innerResponses).map(res => {
              const data = innerResponses[res].content?.['application/json']?.schema as OpenAPIV3.SchemaObject

              return (
                <Tabs.Panel pt='md' key={res} value={res}>
                  {propertyTreeGenerator(data)}
                </Tabs.Panel>
              ) })}

          </Tabs>
        </Box>
      </Flex>
    </Flex>
  )
}

function getType(property: OpenAPIV3.SchemaObject) {
  return property?.type === 'array' ? `${(property?.items as OpenAPIV3.SchemaObject).type}[]` : property?.enum ? property?.enum.map(p => `"${p}"`).join(' | ') : property.type
}

function propertyTreeGenerator(data: OpenAPIV3.SchemaObject, level = 0) {
  const { properties, required } = getProperties(data)
  const keys = Object.keys(properties)

  return (
    <Accordion multiple chevronPosition='left' fz={12}>
      {
        keys?.map((propKey, index) => {
          const property = properties?.[propKey]
          const noContent = !(property.type === 'object' || ((property.type === 'array' && property.items) as OpenAPIV3.SchemaObject).type === 'object' || property.description)

          return (
            <Accordion.Item sx={{ border: (index + 1 === keys.length) && level ? '0 none' : undefined }} key={propKey} value={propKey}>
              {noContent
                ? (

                  <Group fz={15} p='16px 36px'>
                    <Text>{propKey}</Text>
                    <Text fz={13} color='gray.6'>{getType(property)}</Text>
                    <Text>{required?.some((p: string) => p === propKey) ? 'required' : ''}</Text>
                  </Group>

                  )
                : (
                  <Accordion.Control p={0}>
                    <Group fz={15} p='16px 0px'>
                      <Text>{propKey}</Text>
                      <Text fz={13} color='gray.6'>{getType(property)}</Text>
                      <Text>{required?.some((p: string) => p === propKey) ? 'required' : ''}</Text>
                    </Group>
                  </Accordion.Control>
                  )}

              <Accordion.Panel pl={20}>
                <Text>{property.description}</Text>
                {property.type === 'object' && propertyTreeGenerator(property, level + 1)}
                {property.type === 'array' && (property.items as OpenAPIV3.SchemaObject).type === 'object' && propertyTreeGenerator((property.items as OpenAPIV3.SchemaObject) ?? {}, level + 1)}
              </Accordion.Panel>
            </Accordion.Item>
          )
        })
      }
    </Accordion>

  )
}

const DEFINITION_NAME_REGEX = /^#\/components\/(schemas|responses)\/([^/]+)$/

function getDefinitionName(pointer?: string) {
  const [name, component] = pointer?.match(DEFINITION_NAME_REGEX)?.reverse() || []

  return {
    component,
    name
  } as {
    component: keyof OpenAPIV3.ComponentsObject
    name: string
  }
}

function isRef<T>(obj: OpenAPIV3.ReferenceObject | T): obj is OpenAPIV3.ReferenceObject {
  if (!obj) return false
  obj = obj as OpenAPIV3.ReferenceObject

  return obj.$ref !== undefined && obj.$ref !== null
}

function requestGenerator(operation: Operation) {
  if (!operation) return {}
  const req: Record<'query' | 'header' | 'path' | 'cookie' | 'body' | string, OpenAPIV3.RequestBodyObject | OpenAPIV3.ParameterObject[]> = {}

  if (operation?.requestBody) req.body = operation.requestBody as OpenAPIV3.RequestBodyObject

  if (operation?.parameters) {
    const hosts = ['query', 'header', 'path', 'cookie']

    hosts.forEach(host => {
      const obj = operation.parameters?.filter(p => (p as OpenAPIV3.ParameterObject).in === host) as OpenAPIV3.ParameterObject[]

      if (obj.length) req[host] = obj
    })
  }

  return req
}

function responsesGenerator(responses: OpenAPIV3.ResponsesObject) {
  const components = openapiJson.components as OpenAPIV3.ComponentsObject
  const _res: Record<string, OpenAPIV3.ResponseObject> = {}

  for (const status in responses) {
    let response: OpenAPIV3.ResponseObject

    if (isRef(responses[status])) {
      const { name, component } = getDefinitionName((responses[status] as OpenAPIV3.ReferenceObject).$ref)
      response = components?.[component]?.[name] as OpenAPIV3.ResponseObject
    } else {
      response = responses[status] as OpenAPIV3.ResponseObject
    }

    const content: Record<string, OpenAPIV3.MediaTypeObject> = {}

    for (const item in response.content) {
      if (isRef(response?.content[item].schema)) {
        const { name, component } = getDefinitionName((response?.content?.[item]?.schema as OpenAPIV3.ReferenceObject)?.$ref)
        content[item] = { schema: components[component]?.[name] as OpenAPIV3.MediaTypeObject }
      } else {
        content[item] = response?.content[item]
      }
    }

    _res[status] = {
      ...responses[status],
      content
    } as OpenAPIV3.ResponseObject
  }

  return _res
}

function getProperties(data: OpenAPIV3.SchemaObject | undefined, key?: string): { properties: Record<string, OpenAPIV3.SchemaObject>; required: string[] } {
  if (!data) return { properties: {}, required: [] }
  const type = data.type

  if (type === 'array') {
    return { properties: { [key || 'items']: { ...data } }, required: ['items'] }
  }

  return { properties: (data.properties as Record<string, OpenAPIV3.SchemaObject>) ?? {}, required: data.required ?? [] }
}

function parser() {
  const finalDoc: Record<string, Operation[]> = {}
  const paths = openapiJson.paths as any

  for (const path in paths) {
    for (const method in paths[path]) {
      (paths[path][method].tags as string[]).forEach(tag => {
        finalDoc[tag] ??= []
        finalDoc[tag].push({ ...paths[path][method], method, path })
      })
    }
  }

  return finalDoc
}
