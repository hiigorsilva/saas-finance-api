import type { FastifyRequestType } from 'fastify/types/type-provider'

export const parseRequest = (request: FastifyRequestType) => {
  const body = request.body ?? {}
  const params = request.params ?? {}
  const queryParams = request.query ?? {}
  const headers = request.headers ?? {}

  return {
    body,
    params,
    queryParams,
    headers,
  }
}
