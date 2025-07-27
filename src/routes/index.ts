import type { FastifyInstance } from 'fastify'
import { registerHealthRoutes } from '../modules/health/health-check-route'

export const registerRoutes = (app: FastifyInstance) => {
  app.register(registerHealthRoutes)
}
