import Router from '@koa/router'
import chalk from 'chalk'
import glob from 'fast-glob'
import { Middleware } from 'koa'
import compose from 'koa-compose'
import { join } from 'path'

import config from './config'
import * as request from './request'
import * as response from './response'

declare module 'koa' {
  interface ExtendableContext {
    params: {
      [key: string]: string
    }
  }
}

export interface Schema {
  request?: request.RequestSchema
  response?: response.ResponseSchema
}

interface IRouter {
  file: string
  module: object
  path: string
  method: typeof methods[number]
  handle: Middleware
  schema?: Schema
  preHandle?: Middleware | Middleware[]
  postHandle?: Middleware | Middleware[]
}

const cwd = process.cwd()
const debug = require('debug')('apiser:route')
const exts = ['ts', 'js']
const methods = ['head', 'options', 'get', 'put', 'patch', 'post', 'delete'] as const

export function load() {
  const urls = glob.sync(`**/*.{${methods.join(',')}}.{${exts.join(',')}}`, {
    cwd: join(cwd, config.rootDir),
    ignore: [`${cwd}**/node_modules/**`],
    absolute: true,
    onlyFiles: true
  })

  debug('Matched %s files', urls.length)

  const router = new Router()

  urls.map(transform).forEach(route => {
    const { method, path, schema, handle, postHandle, preHandle, file } = route

    if (!handle) {
      debug(
        `Ignore [%s] %s, because the handle export is missing in ${file}`,
        method.toLocaleUpperCase(),
        path
      )
    } else {
      debug('Defined [%s] %s ', method.toLocaleUpperCase(), path, chalk.gray(file))

      const stack: Middleware[] = []

      schema?.request && stack.push(request.validate(schema.request))
      preHandle && stack.push(...[preHandle].flat())
      stack.push(handle)
      postHandle && stack.push(...[postHandle].flat())
      schema?.response && stack.push(response.serialize(schema.response))

      router[method](path, ...stack)
    }
  })

  return compose([router.routes(), router.allowedMethods()])
}

function transform(url: string): IRouter {
  const module = require(url)
  const { method, path } = format(url)
  const { handle, schema, preHandle, postHandle } = module

  return {
    file: url,
    module,
    path,
    method,
    handle,
    schema,
    preHandle,
    postHandle
  }
}

function format(url: string, wildcard = '$') {
  const divide = url
    .replace(join(cwd, config.rootDir), '')
    .replace(/\\/g, '/')
    .replace(new RegExp(`\\${wildcard}`, 'g'), '/:')
    .replace(/\/\//, '/')
    .split('.')

  const method = divide[divide.length - 2] as IRouter['method']
  const path =
    divide
      .splice(0, divide.length - 2)
      .join('.')
      .replace(/\/?index$/, '') || '/'

  return {
    method,
    path
  }
}
