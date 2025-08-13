import type { FastifyInstance } from 'fastify'
import { signinRoute } from './auth/signin-route'
import { signupRoute } from './auth/signup-route'
import { healthRoute } from './check/health-route'
import { transactionRoute } from './transaction/transaction-route'
import { userRoute } from './user/user-route'
import { workspaceRoute } from './workspace/workspace-route'
import { workspaceMemberRoute } from './workspace-member/workspace-member-route'

export const registerRoutes = (app: FastifyInstance) => {
  app.register(healthRoute, { prefix: '/api' })
  app.register(signupRoute, { prefix: '/api' })
  app.register(signinRoute, { prefix: '/api' })
  app.register(userRoute, { prefix: '/api' })
  app.register(workspaceRoute, { prefix: '/api' })
  app.register(workspaceMemberRoute, { prefix: '/api' })
  app.register(transactionRoute, { prefix: '/api' })
}
