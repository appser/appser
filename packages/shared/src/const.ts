export const HttpStatusCode = {
  Created: 201,
  NotContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  RequestTimeout: 408,
  Conflict: 409,
  TooManyRequests: 429,
  InternalServerError: 500
} as const
