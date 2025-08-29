import type { FastifyInstance } from 'fastify'
import { removeTransactionController } from '../instances/remove-transaction.instance'
import { removeTransactionSchema } from '../schemas/remove-transaction.schema'

export const removeTransactionRoute = async (app: FastifyInstance) => {
  app.delete(
    '/:workspaceId/transaction/:transactionId',
    removeTransactionSchema,
    async (request, reply) =>
      await removeTransactionController.handle(request, reply)
  )
}
