declare module 'fastify' {
  interface FastifyRequest {
    userId: string | null
  }
}
