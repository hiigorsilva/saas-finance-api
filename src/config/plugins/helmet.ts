import helmet from '@fastify/helmet'
import type { FastifyInstance } from 'fastify'

export const registerHelmet = (app: FastifyInstance) => {
  app.register(helmet, {
    global: true,
    crossOriginEmbedderPolicy: false,
  })
}
