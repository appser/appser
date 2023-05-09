import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import errorHandler from './errorHandler'
import { useLogger } from './middlewares/useLogger'
import { useSleep } from './middlewares/useSleep'
import doc from './openapi'
import { createLogger } from '../logger'

import type { Module } from './module'
import type { Server as HttpServer } from 'http'
import type { Middleware } from 'koa'
import type { OpenAPIV3 } from 'openapi-types'

const log = createLogger('server')

export class Server {
  #koa
  #modules: Module[] = []

  constructor() {
    this.#koa = new Koa()

    this.#koa
      .use(useLogger)
      .use(bodyParser())
      .on('error', errorHandler)
  }

  get openAPI(): OpenAPIV3.Document {
    this.#modules.forEach((module) => {
      doc.paths = Object.assign(doc.paths, module.router.openAPIPaths)
    })

    return doc
  }

  /**
   * use koa middlewares
   */
  use(middleware: Middleware) {
    this.#koa.use(middleware)

    return this
  }

  mount(module: Module | Module[]) {
    const modules = Array.isArray(module) ? module : [module]

    this.#modules.push(...modules)

    return this
  }

  sleep(ms: number) {
    if (ms > 0 && process.env.NODE_ENV !== 'production') {
      this.#koa.use(useSleep(ms))
    }

    return this
  }

  callback() {
    return this.#koa.callback()
  }

  listen(port?: number, hostname?: string) {
    this.init()

    const server = this.#koa.listen(port, hostname)

    return new Promise<HttpServer>((resolve, reject) => {
      server.on('error', (error: NodeJS.ErrnoException) => {
        if (error.syscall !== 'listen') throw error

        const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

        switch (error.code) {
          case 'EACCES':
            log.error(`${bind} requires elevated privileges`)
            reject(error)

            break
          case 'EADDRINUSE':
            log.error(`${bind} is already in use`)
            reject(error)

            break
          default:
            throw error
        }
      })

      server.on('listening', () => {
        const addr = server.address()
        const bind = typeof addr === 'string' ? `pipe ${addr}` : `${addr?.address}:${addr?.port}`

        log.info(`appser listening at ${bind} in ${process.env.NODE_ENV ?? 'development'} mode`)

        resolve(server)
      })

      process.on('SIGINT', () => {
        log.info('appser is shutting down...')

        server.close(() => {
          log.info('appser is shut down')

          process.exit(0)
        })
      })
    })
  }

  private init() {
    this.#modules.forEach((module) => {
      this.#koa.use(module.router.routes)
    })
  }
}
