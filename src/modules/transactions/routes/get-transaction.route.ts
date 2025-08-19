import type { FastifyInstance } from 'fastify'
import { getTransactionController } from '../instances/get-transaction.instance'
import { getTransactionByIdSchema } from '../schemas/get-transaction-by-id.schema'

export const getTransactionRoute = async (app: FastifyInstance) => {
  app.get(
    '/:workspaceId/transaction/:transactionId',
    getTransactionByIdSchema,
    async (request, reply) =>
      await getTransactionController.handle(request, reply)
  )
}
