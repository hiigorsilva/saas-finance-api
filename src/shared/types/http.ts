declare module 'fastify' {
  interface FastifyRequest {
    userId: string | null
  }
}

export type HttpResponse = {
  statusCode: number
  body?: Record<string, any>
}
