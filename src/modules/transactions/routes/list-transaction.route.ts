import type { FastifyInstance } from 'fastify'
import { listTransactionController } from '../instances/list-transaction.instance'
import { listTransactionSchema } from '../schemas/list-transaction.schema'

export const listTransactionRoute = async (app: FastifyInstance) => {
  app.get(
    '/:workspaceId/transaction',
    listTransactionSchema,
    async (request, reply) =>
      await listTransactionController.handle(request, reply)
  )
}
