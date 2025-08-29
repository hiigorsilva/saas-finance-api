import type { FastifyInstance } from 'fastify'
import { createTransactionController } from '../instances/create-transaction.instance'
import { createTransactionSchema } from '../schemas/create-transaction.schema'

export const createTransactionRoute = async (app: FastifyInstance) => {
  app.post(
    '/:workspaceId/transaction',
    createTransactionSchema,
    async (request, reply) =>
      await createTransactionController.handle(request, reply)
  )
}
