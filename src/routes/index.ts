import type { FastifyInstance } from 'fastify'
import { signinRoute } from './auth/signin-route'
import { signupRoute } from './auth/signup-route'
import { healthRoute } from './check/health-route'
import { transactionRoute } from './transaction/transaction-route'
import { meRoute } from './user/me-route'
import { workspaceRoute } from './workspace/workspace-route'

export const registerRoutes = (app: FastifyInstance) => {
  app.register(healthRoute, { prefix: '/api' })
  app.register(signupRoute, { prefix: '/api' })
  app.register(signinRoute, { prefix: '/api' })
  app.register(meRoute, { prefix: '/api' })
  app.register(workspaceRoute, { prefix: '/api' })
  app.register(transactionRoute, { prefix: '/api' })
}
