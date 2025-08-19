import type { FastifyInstance } from 'fastify'
import { TransactionController } from '../../controllers/transaction-controller'
import { deleteTransaction } from '../../schemas/transactions/delete-transaction'
import { updateTransaction } from '../../schemas/transactions/update-transaction'
import { badRequest, internalServerError } from '../../shared/utils/http'
import { parseResponse } from '../../shared/utils/parse-response'

const transactionController = new TransactionController(transactionService)

export const transactionRoute = async (app: FastifyInstance) => {
  app.delete(
    '/:workspaceId/transaction/:transactionId',
    deleteTransaction,
    async (request, reply) => {
      try {
        const response = await transactionController.delete(request)
        return reply.status(response.statusCode).send(response)
      } catch (error) {
        if (error instanceof Error) {
          return reply
            .status(400)
            .send(parseResponse(badRequest({ error: error.message })))
        }
        return reply
          .status(500)
          .send(
            parseResponse(
              internalServerError({ error: 'Internal server error.' })
            )
          )
      }
    }
  )

  app.put(
    '/:workspaceId/transaction/:transactionId',
    updateTransaction,
    async (request, reply) => {
      try {
        const response = await transactionController.update(request)
        return reply.status(response.statusCode).send(response)
      } catch (error) {
        if (error instanceof Error) {
          return reply
            .status(400)
            .send(parseResponse(badRequest({ error: error.message })))
        }
        return reply
          .status(500)
          .send(
            parseResponse(
              internalServerError({ error: 'Internal server error.' })
            )
          )
      }
    }
  )
}
