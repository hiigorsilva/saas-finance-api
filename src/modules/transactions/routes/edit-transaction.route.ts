import type { FastifyInstance } from 'fastify'
import { editTransactionController } from '../instances/edit-transaction.instance'
import { editTransactionSchema } from '../schemas/edit-transaction.schema'

export const editTransactionRoute = async (app: FastifyInstance) => {
  app.put(
    '/:workspaceId/transaction/:transactionId',
    editTransactionSchema,
    async (request, reply) =>
      await editTransactionController.handle(request, reply)
  )
}
