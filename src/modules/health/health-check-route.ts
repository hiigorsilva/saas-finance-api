import type { FastifyInstance } from 'fastify'
import * as controller from './health-check-controller'
import * as schema from './health-check-schema'

export const registerHealthRoutes = async (app: FastifyInstance) => {
  app.get('/health', schema.health, controller.health)
}
