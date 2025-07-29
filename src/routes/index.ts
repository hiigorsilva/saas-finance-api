import type { FastifyInstance } from 'fastify'
import { getHealthStatusRoute } from '../modules/health/routes/get-check-route'

export const registerRoutes = (app: FastifyInstance) => {
  app.register(getHealthStatusRoute, { prefix: '/api' })
}
