/* eslint-disable no-var */

export declare global {
  declare namespace globalThis {
    var fetch: any
    var Response: any
    var Headers: any
    var Request: any
    var FormData: any

    type Headers = any
    type fetch = any
    type Response = any
    type Request = any
    type FormData = any
    type RequestInit = any
  }
}
