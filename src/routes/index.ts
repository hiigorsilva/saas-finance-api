import type { FastifyInstance } from 'fastify'
import { registerRoute } from '../modules/auth/routes/register.route'
import { signinRoute } from '../modules/auth/routes/signin.route'
import { healthRoute } from '../modules/healths/routes/health.route'
import { listInactiveUserRoute } from '../modules/users/routes/list-inactive-user.route'
import { listUserRoute } from '../modules/users/routes/list-user.route'
import { meRoute } from '../modules/users/routes/me.route'
import { addMemberToWorkspaceRoute } from '../modules/workspace-members/routes/add-member.route'
import { transactionRoute } from './transaction/transaction-route'
import { workspaceRoute } from './workspace/workspace-route'

export const registerRoutes = (app: FastifyInstance) => {
  app.register(healthRoute, { prefix: '/api' })
  app.register(registerRoute, { prefix: '/api' })
  app.register(signinRoute, { prefix: '/api' })
  app.register(meRoute, { prefix: '/api' })
  app.register(listUserRoute, { prefix: '/api' })
  app.register(listInactiveUserRoute, { prefix: '/api' })
  app.register(addMemberToWorkspaceRoute, { prefix: '/api' })

  app.register(workspaceRoute, { prefix: '/api' })
  app.register(transactionRoute, { prefix: '/api' })
}
