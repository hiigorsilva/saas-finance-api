import type { FastifyRequest } from 'fastify'

export type ProtectedHttpRequest = FastifyRequest & {
  userId: string
}

export type HttpResponse = {
  statusCode: number
  body?: Record<string, any>
}
