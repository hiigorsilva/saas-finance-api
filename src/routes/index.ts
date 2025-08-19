import type { FastifyInstance } from 'fastify'
import { registerRoute } from '../modules/auth/routes/register.route'
import { signinRoute } from '../modules/auth/routes/signin.route'
import { healthRoute } from '../modules/healths/routes/health.route'
import { createTransactionRoute } from '../modules/transactions/routes/create-transaction.route'
import { editTransactionRoute } from '../modules/transactions/routes/edit-transaction.route'
import { getTransactionRoute } from '../modules/transactions/routes/get-transaction.route'
import { listTransactionRoute } from '../modules/transactions/routes/list-transaction.route'
import { removeTransactionRoute } from '../modules/transactions/routes/remove-transaction.route'
import { listInactiveUserRoute } from '../modules/users/routes/list-inactive-user.route'
import { listUserRoute } from '../modules/users/routes/list-user.route'
import { meRoute } from '../modules/users/routes/me.route'
import { addMemberToWorkspaceRoute } from '../modules/workspace-members/routes/add-member.route'
import { listMemberWorkspaceRoute } from '../modules/workspace-members/routes/list-member.route'
import { removeMemberFromWorkspaceRoute } from '../modules/workspace-members/routes/remove-member.route'
import { createWorkspaceRoute } from '../modules/workspaces/routes/create-workspace.route'
import { editWorkspaceRoute } from '../modules/workspaces/routes/edit-workspace.route'
import { getWorkspaceByIdRoute } from '../modules/workspaces/routes/get-workspace-by-id.route'
import { listWorkspaceRoute } from '../modules/workspaces/routes/list-workspace.route'
import { removeWorkspaceRoute } from '../modules/workspaces/routes/remove-workspace.route'

export const registerRoutes = (app: FastifyInstance) => {
  app.register(healthRoute, { prefix: '/api' })
  app.register(registerRoute, { prefix: '/api' })
  app.register(signinRoute, { prefix: '/api' })

  app.register(meRoute, { prefix: '/api' })
  app.register(listUserRoute, { prefix: '/api' })
  app.register(listInactiveUserRoute, { prefix: '/api' })

  app.register(createWorkspaceRoute, { prefix: '/api' })
  app.register(listWorkspaceRoute, { prefix: '/api' })
  app.register(getWorkspaceByIdRoute, { prefix: '/api' })
  app.register(editWorkspaceRoute, { prefix: '/api' })
  app.register(removeWorkspaceRoute, { prefix: '/api' })

  app.register(createTransactionRoute, { prefix: '/api' })
  app.register(listTransactionRoute, { prefix: '/api' })
  app.register(getTransactionRoute, { prefix: '/api' })
  app.register(editTransactionRoute, { prefix: '/api' })
  app.register(removeTransactionRoute, { prefix: '/api' })

  app.register(addMemberToWorkspaceRoute, { prefix: '/api' })
  app.register(listMemberWorkspaceRoute, { prefix: '/api' })
  app.register(removeMemberFromWorkspaceRoute, { prefix: '/api' })
}
